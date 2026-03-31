import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendInquiryResponseEmail } from "@/lib/email";

const schema = z.object({
  response: z
    .string()
    .min(10, "Response must be at least 10 characters")
    .max(5000),
  status: z
    .enum(["accepted", "declined"])
    .default("accepted"),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: inquiryId } = await params;
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Must be a supplier
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, email")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "supplier") {
      return NextResponse.json(
        { error: "Only supplier accounts can respond to inquiries" },
        { status: 403 }
      );
    }

    // Get the supplier record owned by this user
    const { data: supplier } = await supabase
      .from("suppliers")
      .select("id, name, city")
      .eq("user_id", user.id)
      .single();

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier profile not found" },
        { status: 404 }
      );
    }

    // Fetch the inquiry and verify it belongs to this supplier
    const { data: inquiry } = await supabase
      .from("inquiries")
      .select("id, buyer_id, supplier_id, message, product_interest, status")
      .eq("id", inquiryId)
      .single();

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (inquiry.supplier_id !== supplier.id) {
      return NextResponse.json(
        { error: "You do not have permission to respond to this inquiry" },
        { status: 403 }
      );
    }

    if (inquiry.status !== "pending") {
      return NextResponse.json(
        { error: `Inquiry already ${inquiry.status}` },
        { status: 409 }
      );
    }

    // Validate request body
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { response: responseText, status } = parsed.data;

    // Update the inquiry
    const { data: updated, error: updateError } = await supabase
      .from("inquiries")
      .update({
        supplier_response: responseText,
        status,
        responded_at: new Date().toISOString(),
      })
      .eq("id", inquiryId)
      .select()
      .single();

    if (updateError) {
      console.error("[PATCH /api/inquiries/[id]/respond] update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save response" },
        { status: 500 }
      );
    }

    // Get buyer details to send the notification email
    const { data: buyer } = await supabase
      .from("buyers")
      .select("id, full_name, country, user_id")
      .eq("id", inquiry.buyer_id)
      .single();

    if (buyer) {
      const { data: buyerProfile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", buyer.user_id)
        .single();

      if (buyerProfile?.email) {
        // Extract subject from message (first line after "Subject: ")
        const subjectLine = inquiry.message.split("\n")[0] ?? "";
        const subject = subjectLine.startsWith("Subject: ")
          ? subjectLine.replace("Subject: ", "")
          : "Your inquiry";

        sendInquiryResponseEmail({
          buyerEmail: buyerProfile.email,
          buyerName:
            buyer.full_name ?? buyerProfile.full_name ?? "Buyer",
          supplierName: supplier.name,
          supplierCity: supplier.city,
          subject,
          responseText,
          inquiryId,
        }).catch((err) =>
          console.error("[PATCH /api/inquiries/[id]/respond] email error:", err)
        );
      }
    }

    return NextResponse.json({ inquiry: updated });
  } catch (err) {
    console.error("[PATCH /api/inquiries/[id]/respond]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
