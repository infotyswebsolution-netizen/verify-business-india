import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendVerificationCompleteEmail } from "@/lib/email";

const checklistItemSchema = z.object({
  id: z.number(),
  label: z.string(),
  result: z.enum(["pass", "fail", "partial"]),
});

const schema = z.object({
  supplier_id: z.string().uuid(),
  score: z.number().min(1).max(100),
  tier: z.enum(["bronze", "silver", "gold"]),
  checklist: z.array(checklistItemSchema).length(25),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { supplier_id, score, tier, checklist, notes } = parsed.data;

  const { data: supplier, error: fetchError } = await supabase
    .from("suppliers")
    .select("id, name, slug, user_id")
    .eq("id", supplier_id)
    .single();

  if (fetchError || !supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  const now = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("suppliers")
    .update({
      verification_status: "verified",
      verification_tier: tier,
      verification_score: score,
      verified_at: now,
      updated_at: now,
    })
    .eq("id", supplier_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabase.from("audits").insert({
    supplier_id,
    auditor_user_id: user.id,
    score,
    tier,
    checklist,
    notes: notes ?? null,
    audited_at: now,
  }).then(({ error }) => {
    if (error) console.error("audit insert error:", error.message);
  });

  const { data: supplierProfile } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", supplier.user_id)
    .single();

  if (supplierProfile?.email) {
    await sendVerificationCompleteEmail({
      supplierEmail: supplierProfile.email,
      supplierName: supplier.name,
      tier,
      score,
      supplierSlug: supplier.slug ?? supplier.id,
    }).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
