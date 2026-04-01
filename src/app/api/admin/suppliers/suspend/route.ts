import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendSuspensionEmail } from "@/lib/email";

const schema = z.object({
  supplier_id: z.string().uuid(),
  reason: z.string().optional(),
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

  const { supplier_id, reason } = parsed.data;

  const { data: supplier, error: fetchError } = await supabase
    .from("suppliers")
    .select("id, name, user_id")
    .eq("id", supplier_id)
    .single();

  if (fetchError || !supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("suppliers")
    .update({
      verification_status: "suspended",
      updated_at: new Date().toISOString(),
    })
    .eq("id", supplier_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data: supplierProfile } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", supplier.user_id)
    .single();

  if (supplierProfile?.email) {
    await sendSuspensionEmail({
      supplierEmail: supplierProfile.email,
      supplierName: supplier.name,
      reason: reason ?? undefined,
    }).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
