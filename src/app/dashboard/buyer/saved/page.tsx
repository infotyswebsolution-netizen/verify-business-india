import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SavedList, SavedSupplierRow } from "./SavedList";

export const metadata: Metadata = { title: "Saved Suppliers" };
export const dynamic = "force-dynamic";

export default async function SavedSuppliersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

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

  // JOIN saved_suppliers → suppliers
  const { data: rows } = await supabase
    .from("saved_suppliers")
    .select(
      `id,
       supplier_id,
       suppliers(
         id, name, slug, city, state, industry, tier, verified_at,
         description, min_order_value, min_order_currency, export_capability
       )`
    )
    .eq("buyer_id", buyer.id)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: SavedSupplierRow[] = ((rows ?? []) as any[])
    .filter((r) => r.suppliers)
    .map((r) => {
      // Supabase may return the joined record as an object or single-element array
      const s = Array.isArray(r.suppliers) ? r.suppliers[0] : r.suppliers;
      return {
        savedId: r.id,
        supplierId: r.supplier_id,
        name: s.name,
        slug: s.slug,
        city: s.city,
        state: s.state,
        industry: s.industry,
        tier: s.tier,
        verified_at: s.verified_at,
        description: s.description,
        min_order_value: s.min_order_value,
        min_order_currency: s.min_order_currency,
        export_capability: s.export_capability,
      };
    });

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink">Saved Suppliers</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {items.length} supplier{items.length !== 1 ? "s" : ""} shortlisted
            </p>
          </div>
          <Link
            href="/suppliers"
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-white transition-colors"
          >
            <Search size={15} />
            Browse More
          </Link>
        </div>

        <SavedList items={items} buyerId={buyer.id} />
      </div>
    </div>
  );
}
