import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SupplierInquiriesList, SupplierInquiry } from "./SupplierInquiriesList";

export const metadata: Metadata = { title: "Incoming Inquiries" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function SupplierInquiriesPage({ searchParams }: PageProps) {
  const { id: selectedId } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!supplier) redirect("/dashboard/supplier");

  const { data: rows } = await supabase
    .from("inquiries")
    .select(`
      id, created_at, status, message, product_interest,
      estimated_order_value, supplier_response, responded_at,
      buyers(company, country)
    `)
    .eq("supplier_id", supplier.id)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inquiries: SupplierInquiry[] = ((rows ?? []) as any[]).map((r) => {
    const buyer = Array.isArray(r.buyers) ? r.buyers[0] : r.buyers;
    return {
      id: r.id,
      created_at: r.created_at,
      status: r.status as "pending" | "accepted" | "declined",
      message: r.message,
      product_interest: r.product_interest,
      estimated_order_value: r.estimated_order_value,
      supplier_response: r.supplier_response,
      responded_at: r.responded_at,
      buyer_company: buyer?.company ?? "Unknown Company",
      buyer_country: buyer?.country ?? "—",
    };
  });

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Incoming Inquiries</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {inquiries.length} total · {inquiries.filter((i) => i.status === "pending").length} awaiting your response
          </p>
        </div>
        <SupplierInquiriesList inquiries={inquiries} selectedId={selectedId} />
      </div>
    </div>
  );
}
