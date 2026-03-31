import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supplier_user_id;
        const plan = session.metadata?.plan;

        if (!userId || !plan) break;

        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as Stripe.Subscription;

        const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
        const periodStart = (sub as unknown as { current_period_start: number }).current_period_start;

        await supabase.from("suppliers").update({
          tier: plan,
          subscription_id: sub.id,
          active_until: new Date(periodEnd * 1000).toISOString(),
        }).eq("user_id", userId);

        await supabase.from("subscriptions").upsert({
          supplier_id: userId,
          plan,
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items.data[0].price.id,
          status: "active",
          current_period_start: new Date(periodStart * 1000).toISOString(),
          current_period_end: new Date(periodEnd * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supplier_user_id;

        if (!userId) break;

        const subData = subscription as unknown as {
          current_period_start: number;
          current_period_end: number;
        };

        await supabase.from("subscriptions").update({
          status: subscription.status,
          current_period_start: new Date(subData.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        }).eq("stripe_subscription_id", subscription.id);

        await supabase.from("suppliers").update({
          active_until: new Date(subData.current_period_end * 1000).toISOString(),
        }).eq("user_id", userId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supplier_user_id;

        if (!userId) break;

        await supabase.from("subscriptions").update({
          status: "canceled",
        }).eq("stripe_subscription_id", subscription.id);

        await supabase.from("suppliers").update({
          tier: null,
          subscription_id: null,
          active_until: null,
        }).eq("user_id", userId);

        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
