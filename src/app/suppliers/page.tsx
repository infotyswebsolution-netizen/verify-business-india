import { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { SupplierCard } from "@/components/suppliers/SupplierCard";
import { GUJARAT_CITIES, INDUSTRIES } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Find Verified Suppliers in Gujarat, India",
  description:
    "Browse 500+ physically audited, verified Gujarat manufacturers. Filter by city, industry, verification tier, and export capability. Trusted by international buyers.",
};

interface SuppliersPageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    industry?: string;
    tier?: string;
    export?: string;
    minOrder?: string;
    sort?: string;
    page?: string;
  }>;
}

const SORT_OPTIONS = [
  { value: "score", label: "Highest Score" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "newest", label: "Newest Listed" },
  { value: "az", label: "Alphabetical" },
];

const MIN_ORDER_OPTIONS = [
  { value: "0-1000", label: "Under $1K" },
  { value: "1000-10000", label: "$1K – $10K" },
  { value: "10000-50000", label: "$10K – $50K" },
  { value: "50000+", label: "$50K+" },
];

export default async function SuppliersPage({
  searchParams,
}: SuppliersPageProps) {
  const params = await searchParams;
  const { q, city, industry, tier, sort = "score" } = params;

  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from("suppliers")
    .select("*, supplier_media(id, url, is_primary)")
    .eq("verification_status", "verified")
    .not("published_at", "is", null);

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,description.ilike.%${q}%,city.ilike.%${q}%`
    );
  }
  if (city) query = query.eq("city", city);
  if (industry) query = query.eq("industry", industry);
  if (tier) query = query.eq("tier", tier);

  if (sort === "score")
    query = query.order("verification_score", { ascending: false });
  else if (sort === "reviews")
    query = query.order("review_count", { ascending: false });
  else if (sort === "newest")
    query = query.order("published_at", { ascending: false });
  else query = query.order("name", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error("Suppliers fetch error:", error);
  }

  // Map DB columns to the shape SupplierCard expects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const suppliers = ((data as any[]) ?? []).map((s: any) => ({
    ...s,
    // Map DB column names → Supplier type fields
    status: s.verification_status,
    min_order_value: s.min_order_usd,
    min_order_currency: "USD",
    // Derive primary_photo from joined supplier_media
    primary_photo:
      (s.supplier_media as { url: string; is_primary: boolean }[])?.find(
        (m) => m.is_primary
      )?.url ??
      (s.supplier_media as { url: string }[])?.[0]?.url ??
      null,
  }));

  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-ink mb-1">
            Verified Gujarat Suppliers
          </h1>
          <p className="text-gray-500 text-sm">
            {suppliers.length} verified supplier{suppliers.length !== 1 ? "s" : ""} found
            {q ? ` for "${q}"` : ""}
            {industry ? ` in ${industry}` : ""}
            {city ? ` · ${city}` : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <form className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6 sticky top-24">
              <div className="flex items-center gap-2 font-semibold text-ink">
                <SlidersHorizontal size={16} />
                Filters
              </div>

              {/* Search */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="q"
                    type="text"
                    defaultValue={q}
                    placeholder="Products, industry..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  City
                </label>
                <select
                  name="city"
                  defaultValue={city}
                  className="w-full py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-white"
                >
                  <option value="">All Cities</option>
                  {GUJARAT_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  defaultValue={industry}
                  className="w-full py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-white"
                >
                  <option value="">All Industries</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
              </div>

              {/* Verification Tier */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Verification Tier
                </label>
                <div className="space-y-2">
                  {["gold", "silver", "bronze"].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tier"
                        value={t}
                        defaultChecked={tier === t}
                        className="accent-gold"
                      />
                      <span className="text-sm text-gray-700 capitalize">{t}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tier"
                      value=""
                      defaultChecked={!tier}
                      className="accent-gold"
                    />
                    <span className="text-sm text-gray-700">All Tiers</span>
                  </label>
                </div>
              </div>

              {/* Min Order */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Min. Order Value
                </label>
                <select
                  name="minOrder"
                  defaultValue={params.minOrder}
                  className="w-full py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-white"
                >
                  <option value="">Any Amount</option>
                  {MIN_ORDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Export */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="export"
                    defaultChecked={params.export === "true"}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Export Capability Only</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-trust text-white font-semibold py-2.5 rounded-lg hover:bg-trust/90 transition-colors text-sm"
              >
                Apply Filters
              </button>

              {(q || city || industry || tier) && (
                <Link
                  href="/suppliers"
                  className="block text-center text-sm text-gray-500 hover:text-gold transition-colors"
                >
                  Clear all filters
                </Link>
              )}
            </form>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <span className="text-sm text-gray-600">
                Showing{" "}
                <strong className="text-ink">{suppliers.length}</strong>{" "}
                verified suppliers
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="flex gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <Link
                      key={opt.value}
                      href={`/suppliers?${new URLSearchParams({ ...params, sort: opt.value }).toString()}`}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        sort === opt.value
                          ? "bg-trust text-white border-trust"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gold"
                      }`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {suppliers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {suppliers.map((supplier: any) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package size={48} className="text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-ink mb-2">
                  No suppliers found
                </h3>
                <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
                  Try adjusting your filters or search terms. New suppliers are
                  added weekly.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-trust text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-trust/90 transition-colors"
                >
                  Request a supplier audit
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
