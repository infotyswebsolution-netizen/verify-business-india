import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendNewInquiryEmail } from "@/lib/email";

const BUDGET_LABELS: Record<string, string> = {
  under_5k: "Under $5,000",
  "5k_25k": "$5,000 – $25,000",
  "25k_100k": "$25,000 – $100,000",
  "100k_plus": "$100,000+",
};

const BUDGET_VALUES: Record<string, number> = {
  under_5k: 2500,
  "5k_25k": 15000,
  "25k_100k": 62500,
  "100k_plus": 150000,
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "As soon as possible",
  "1_month": "Within 1 month",
  "3_months": "Within 3 months",
  "6_plus": "6+ months",
};

const schema = z.object({
  supplierId: z.string().uuid("Invalid supplier ID"),
  subject: z.string().min(3).max(120),
  sourcing: z.string().min(20).max(2000),
  quantity: z.string().max(100).optional(),
  budget: z.enum(["under_5k", "5k_25k", "25k_100k", "100k_plus"]),
  timeline: z.enum(["asap", "1_month", "3_months", "6_plus"]),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Must be a buyer
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, email")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "buyer") {
      return NextResponse.json(
        { error: "Only buyer accounts can send inquiries" },
        { status: 403 }
      );
    }

    // Validate body
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { supplierId, subject, sourcing, quantity, budget, timeline } =
      parsed.data;

    // Get buyer record
    const { data: buyer } = await supabase
      .from("buyers")
      .select("id, full_name, company, country")
      .eq("user_id", user.id)
      .single();

    if (!buyer) {
      return NextResponse.json(
        { error: "Buyer profile not found. Please complete your profile." },
        { status: 404 }
      );
    }

    // Get supplier record (for email + duplicate check)
    const { data: supplier } = await supabase
      .from("suppliers")
      .select("id, name, slug, email, city, user_id")
      .eq("id", supplierId)
      .single();

    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    // Duplicate check — one open inquiry per buyer per supplier
    const { data: existing } = await supabase
      .from("inquiries")
      .select("id")
      .eq("buyer_id", buyer.id)
      .eq("supplier_id", supplier.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You already have an inquiry with this supplier" },
        { status: 409 }
      );
    }

    // Build the message field (combines subject + formatted details)
    const messageParts = [
      `Subject: ${subject}`,
      ``,
      sourcing,
      ``,
      `Timeline: ${TIMELINE_LABELS[timeline]}`,
      quantity ? `Quantity: ${quantity}` : null,
    ].filter(Boolean);

    const message = messageParts.join("\n");

    // Insert inquiry
    const { data: inquiry, error: insertError } = await supabase
      .from("inquiries")
      .insert({
        buyer_id: buyer.id,
        supplier_id: supplier.id,
        message,
        product_interest: sourcing,
        estimated_order_value: BUDGET_VALUES[budget],
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("[POST /api/inquiries] insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save inquiry" },
        { status: 500 }
      );
    }

    // Send email to supplier (non-blocking — don't fail the request if email fails)
    const supplierEmail = supplier.email;
    if (supplierEmail) {
      sendNewInquiryEmail({
        supplierEmail,
        supplierName: supplier.name,
        buyerName: buyer.full_name ?? profile.full_name ?? "A buyer",
        buyerCompany: buyer.company ?? "Unknown company",
        buyerCountry: buyer.country,
        subject,
        sourcing,
        quantity: quantity ?? "",
        budget: BUDGET_LABELS[budget],
        timeline: TIMELINE_LABELS[timeline],
        inquiryId: inquiry.id,
      }).catch((err) =>
        console.error("[POST /api/inquiries] email error:", err)
      );
    }

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
