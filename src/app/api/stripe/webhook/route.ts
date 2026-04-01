import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendSubscriptionConfirmedEmail,
  sendSubscriptionEndedEmail,
} from "@/lib/email";
import Stripe from "stripe";

// Stripe requires the raw body string for signature verification —
// do NOT use NextRequest.json() before this point.
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      // ── Payment completed → activate subscription ──────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Support both metadata key conventions
        const userId =
          session.metadata?.supplier_user_id ??
          session.metadata?.supplierId ??
          null;
        const plan = session.metadata?.plan as
          | "bronze"
          | "silver"
          | "gold"
          | undefined;

        if (!userId || !plan) break;

        const sub = (await stripe.subscriptions.retrieve(
          session.subscription as string
        )) as unknown as { id: string; current_period_end: number; items: { data: { price: { id: string } }[] } };

        const periodEnd = sub.current_period_end;
        const activeUntil = new Date(periodEnd * 1000).toISOString();

        await supabase
          .from("suppliers")
          .update({
            tier: plan,
            subscription_id: sub.id,
            active_until: activeUntil,
          })
          .eq("user_id", userId);

        // Lookup supplier name + email for the confirmation email
        const [{ data: supplier }, { data: profile }] = await Promise.all([
          supabase
            .from("suppliers")
            .select("name")
            .eq("user_id", userId)
            .single(),
          supabase
            .from("profiles")
            .select("email")
            .eq("user_id", userId)
            .single(),
        ]);

        if (profile?.email) {
          await sendSubscriptionConfirmedEmail({
            supplierEmail: profile.email,
            supplierName: supplier?.name ?? "Supplier",
            plan,
          }).catch(console.error);
        }

        break;
      }

      // ── Subscription renewed / upgraded / downgraded ───────────────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supplier_user_id;
        if (!userId) break;

        const subData = subscription as unknown as {
          current_period_start: number;
          current_period_end: number;
        };

        const periodEnd = new Date(
          subData.current_period_end * 1000
        ).toISOString();

        await Promise.all([
          supabase
            .from("suppliers")
            .update({ active_until: periodEnd })
            .eq("user_id", userId),
          supabase
            .from("subscriptions")
            .update({
              status: subscription.status,
              current_period_start: new Date(
                subData.current_period_start * 1000
              ).toISOString(),
              current_period_end: periodEnd,
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
            .eq("stripe_subscription_id", subscription.id),
        ]);

        break;
      }

      // ── Subscription cancelled ─────────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supplier_user_id;
        if (!userId) break;

        await Promise.all([
          supabase
            .from("suppliers")
            .update({ tier: null, subscription_id: null, active_until: null })
            .eq("user_id", userId),
          supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("stripe_subscription_id", subscription.id),
        ]);

        const [{ data: supplier }, { data: profile }] = await Promise.all([
          supabase
            .from("suppliers")
            .select("name")
            .eq("user_id", userId)
            .single(),
          supabase
            .from("profiles")
            .select("email")
            .eq("user_id", userId)
            .single(),
        ]);

        if (profile?.email) {
          await sendSubscriptionEndedEmail({
            supplierEmail: profile.email,
            supplierName: supplier?.name ?? "Supplier",
          }).catch(console.error);
        }

        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
