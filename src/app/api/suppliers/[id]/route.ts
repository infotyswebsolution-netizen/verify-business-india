import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(5000).optional(),
  production_volume: z.string().max(200).optional(),
  min_order_value: z.number().min(0).nullable().optional(),
  min_order_currency: z.string().length(3).optional(),
  lead_time_days: z.number().min(0).nullable().optional(),
  export_capability: z.boolean().optional(),
  export_countries: z.array(z.string()).optional(),
  product_categories: z.array(z.string()).optional(),
  phone: z.string().max(30).nullable().optional(),
  whatsapp: z.string().max(30).nullable().optional(),
  email: z.string().email().nullable().optional(),
  website: z.string().url().nullable().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Verify the supplier belongs to this user
    const { data: supplier } = await supabase
      .from("suppliers")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (!supplier || supplier.user_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from("suppliers")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PATCH /api/suppliers/[id]]", error);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ supplier: updated });
  } catch (err) {
    console.error("[PATCH /api/suppliers/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
