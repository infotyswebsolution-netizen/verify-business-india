import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const buyerSchema = z.object({
  userId: z.string().uuid(),
  role: z.literal("buyer"),
  fullName: z.string().min(1),
  company: z.string().min(1),
  country: z.string().min(2).max(2),
});

const supplierSchema = z.object({
  userId: z.string().uuid(),
  role: z.literal("supplier"),
  fullName: z.string().min(1),
  companyName: z.string().min(2),
  city: z.string().min(1),
  industry: z.string().min(1),
  gstNumber: z.string().optional(),
  plan: z.enum(["bronze", "silver", "gold"]).default("bronze"),
});

const schema = z.discriminatedUnion("role", [buyerSchema, supplierSchema]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();
    const data = parsed.data;

    // Update the profile row created by the DB trigger
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        role: data.role,
        full_name: data.fullName,
      })
      .eq("user_id", data.userId);

    if (profileError) {
      // Profile might not exist yet (trigger delay) — upsert instead
      await supabase.from("profiles").upsert({
        user_id: data.userId,
        role: data.role,
        full_name: data.fullName,
        email: "", // will be filled by trigger
      });
    }

    if (data.role === "buyer") {
      const { error } = await supabase.from("buyers").upsert({
        user_id: data.userId,
        company: data.company,
        country: data.country,
        full_name: data.fullName,
        verified_email: false,
      });
      if (error) throw error;
    }

    if (data.role === "supplier") {
      const baseSlug = slugify(data.companyName);
      // Ensure slug is unique by appending random suffix if needed
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

      const { error } = await supabase.from("suppliers").upsert({
        user_id: data.userId,
        name: data.companyName,
        slug,
        city: data.city,
        state: "Gujarat",
        industry: data.industry,
        gst_number: data.gstNumber ?? null,
        status: "pending_review",
        tier: null,
        export_capability: false,
        product_categories: [],
        export_countries: [],
        featured: false,
      });
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[COMPLETE_SIGNUP]", error);
    return NextResponse.json(
      { error: "Failed to complete signup" },
      { status: 500 }
    );
  }
}
