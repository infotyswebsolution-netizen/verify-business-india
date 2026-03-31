import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { InquiriesList, InquiryRow } from "./InquiriesList";

export const metadata: Metadata = { title: "My Inquiries" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function BuyerInquiriesPage({ searchParams }: PageProps) {
  const { id: selectedId } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get buyer record
  const { data: buyer } = await supabase
    .from("buyers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!buyer) {
    return (
      <div className="p-8">
        <p className="text-gray-500 text-sm">Buyer profile not found.</p>
      </div>
    );
  }

  // Fetch all inquiries with joined supplier data
  const { data: rows } = await supabase
    .from("inquiries")
    .select(
      `id, created_at, status, message, product_interest, estimated_order_value,
       supplier_id, supplier_response, responded_at,
       suppliers(name, slug, tier)`
    )
    .eq("buyer_id", buyer.id)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inquiries: InquiryRow[] = ((rows ?? []) as any[]).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    status: r.status as "pending" | "accepted" | "declined",
    message: r.message,
    product_interest: r.product_interest,
    estimated_order_value: r.estimated_order_value,
    supplier_id: r.supplier_id,
    supplier_name: r.suppliers?.name ?? r.suppliers?.[0]?.name ?? "Unknown Supplier",
    supplier_slug: r.suppliers?.slug ?? r.suppliers?.[0]?.slug ?? "",
    supplier_tier: r.suppliers?.tier ?? r.suppliers?.[0]?.tier ?? null,
    supplier_response: r.supplier_response,
    responded_at: r.responded_at,
  }));

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink">My Inquiries</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {inquiries.length} total · track your sourcing conversations
            </p>
          </div>
          <Link
            href="/suppliers"
            className="inline-flex items-center gap-1.5 bg-trust text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-trust/90 transition-colors"
          >
            <Plus size={15} />
            New Inquiry
          </Link>
        </div>

        <InquiriesList inquiries={inquiries} selectedId={selectedId} />
      </div>
    </div>
  );
}
