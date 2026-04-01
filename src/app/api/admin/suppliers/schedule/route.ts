import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendAuditScheduledEmail } from "@/lib/email";

const schema = z.object({
  supplier_id: z.string().uuid(),
  audit_date: z.string().min(1),
  auditor_name: z.string().min(1),
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

  const { supplier_id, audit_date, auditor_name, notes } = parsed.data;

  const { data: supplier, error: fetchError } = await supabase
    .from("suppliers")
    .select("id, name, user_id, verification_status")
    .eq("id", supplier_id)
    .single();

  if (fetchError || !supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("suppliers")
    .update({
      verification_status: "under_review",
      updated_at: new Date().toISOString(),
    })
    .eq("id", supplier_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data: profile2 } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", supplier.user_id)
    .single();

  if (profile2?.email) {
    await sendAuditScheduledEmail({
      supplierEmail: profile2.email,
      supplierName: supplier.name,
      auditDate: audit_date,
      auditorName: auditor_name,
      notes: notes ?? undefined,
    }).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
