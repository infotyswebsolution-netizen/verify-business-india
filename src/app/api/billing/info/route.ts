import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { data: supplier } = await supabase
      .from("suppliers")
      .select("tier, active_until, stripe_customer_id, subscription_id")
      .eq("user_id", user.id)
      .single();

    if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Try to get plan from subscriptions table
    let plan: string | null = null;
    if (supplier.subscription_id) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("stripe_subscription_id", supplier.subscription_id)
        .single();
      plan = sub?.plan ?? null;
    }

    // Fall back to tier if no subscription record
    if (!plan) plan = supplier.tier ?? null;

    return NextResponse.json({
      plan,
      active_until: supplier.active_until,
      stripe_customer_id: supplier.stripe_customer_id,
      tier: supplier.tier,
    });
  } catch (err) {
    console.error("[GET /api/billing/info]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
