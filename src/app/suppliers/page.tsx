import { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { SupplierCard } from "@/components/suppliers/SupplierCard";
import { GUJARAT_CITIES, INDUSTRIES } from "@/lib/utils";

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

// Seeded demo suppliers for UI development
const DEMO_SUPPLIERS = [
  {
    id: "1",
    name: "Shree Textile Mills",
    slug: "shree-textile-mills",
    city: "Surat",
    state: "Gujarat",
    industry: "textiles",
    tier: "gold" as const,
    verification_score: 92,
    verified_at: "2024-12-01",
    export_capability: true,
    export_countries: ["USA", "Canada", "UK", "Germany"],
    product_categories: ["Synthetic Fabrics", "Sarees", "Dress Material", "Lace Fabric"],
    min_order_value: 500,
    min_order_currency: "USD",
    lead_time_days: 21,
    production_volume: "50,000 meters/month",
    featured: true,
    gst_number: "24AABCS1429B1ZC",
    description: "Leading manufacturer of premium synthetic fabrics since 1985.",
    created_at: "2024-01-01",
    updated_at: "2024-12-01",
    status: "verified" as const,
    website: null, whatsapp: null, email: null, phone: null,
    user_id: null, stripe_customer_id: null, subscription_id: null, active_until: null,
    avg_rating: 4.8,
    review_count: 18,
  },
  {
    id: "2",
    name: "Rajkot Precision Engineering",
    slug: "rajkot-precision-engineering",
    city: "Rajkot",
    state: "Gujarat",
    industry: "metals",
    tier: "gold" as const,
    verification_score: 88,
    verified_at: "2024-11-15",
    export_capability: true,
    export_countries: ["USA", "Canada", "Australia"],
    product_categories: ["CNC Components", "Castings", "Auto Parts", "Welded Assemblies"],
    min_order_value: 2000,
    min_order_currency: "USD",
    lead_time_days: 30,
    production_volume: "5,000 units/month",
    featured: false,
    gst_number: "24AAACR5829B1ZA",
    description: "ISO 9001 certified precision engineering manufacturer.",
    created_at: "2024-01-15",
    updated_at: "2024-11-15",
    status: "verified" as const,
    website: null, whatsapp: null, email: null, phone: null,
    user_id: null, stripe_customer_id: null, subscription_id: null, active_until: null,
    avg_rating: 4.9,
    review_count: 12,
  },
  {
    id: "3",
    name: "Diamond Star Exports",
    slug: "diamond-star-exports",
    city: "Surat",
    state: "Gujarat",
    industry: "diamonds",
    tier: "silver" as const,
    verification_score: 79,
    verified_at: "2024-10-20",
    export_capability: true,
    export_countries: ["USA", "Belgium", "UAE", "Hong Kong"],
    product_categories: ["Brilliant Cut", "Princess Cut", "Loose Diamonds", "Polished Diamonds"],
    min_order_value: 10000,
    min_order_currency: "USD",
    lead_time_days: 14,
    production_volume: "10,000 carats/month",
    featured: false,
    gst_number: "24AABCD7829B1ZB",
    description: "Premium diamond polishing and export house since 2001.",
    created_at: "2024-02-01",
    updated_at: "2024-10-20",
    status: "verified" as const,
    website: null, whatsapp: null, email: null, phone: null,
    user_id: null, stripe_customer_id: null, subscription_id: null, active_until: null,
    avg_rating: 4.6,
    review_count: 7,
  },
  {
    id: "4",
    name: "Ahmedabad Chem Industries",
    slug: "ahmedabad-chem-industries",
    city: "Ahmedabad",
    state: "Gujarat",
    industry: "chemicals",
    tier: "silver" as const,
    verification_score: 74,
    verified_at: "2024-09-10",
    export_capability: true,
    export_countries: ["USA", "Germany", "Netherlands"],
    product_categories: ["Specialty Chemicals", "Surfactants", "Dyes & Pigments"],
    min_order_value: 5000,
    min_order_currency: "USD",
    lead_time_days: 45,
    production_volume: "500 MT/month",
    featured: false,
    gst_number: "24AAACA3829B1ZD",
    description: "Manufacturer of specialty chemicals and surfactants.",
    created_at: "2024-03-01",
    updated_at: "2024-09-10",
    status: "verified" as const,
    website: null, whatsapp: null, email: null, phone: null,
    user_id: null, stripe_customer_id: null, subscription_id: null, active_until: null,
    avg_rating: 4.3,
    review_count: 5,
  },
  {
    id: "5",
    name: "Morbi Ceramic World",
    slug: "morbi-ceramic-world",
    city: "Morbi",
    state: "Gujarat",
    industry: "ceramics",
    tier: "bronze" as const,
    verification_score: 61,
    verified_at: "2024-08-05",
    export_capability: true,
    export_countries: ["USA", "Canada", "Middle East"],
    product_categories: ["Floor Tiles", "Wall Tiles", "Vitrified Tiles", "Sanitary Ware"],
    min_order_value: 3000,
    min_order_currency: "USD",
    lead_time_days: 35,
    production_volume: "100,000 sq ft/month",
    featured: false,
    gst_number: "24AAACM5829B1ZE",
    description: "World-class ceramic tile manufacturer from Morbi, the ceramic capital.",
    created_at: "2024-04-01",
    updated_at: "2024-08-05",
    status: "verified" as const,
    website: null, whatsapp: null, email: null, phone: null,
    user_id: null, stripe_customer_id: null, subscription_id: null, active_until: null,
    avg_rating: 4.1,
    review_count: 9,
  },
  {
    id: "6",
    name: "Vadodara Pharma Labs",
    slug: "vadodara-pharma-labs",
    city: "Vadodara",
    state: "Gujarat",
    industry: "pharmaceuticals",
    tier: "gold" as const,
    verification_score: 95,
    verified_at: "2024-12-10",
    export_capability: true,
    export_countries: ["USA", "Canada", "UK", "Australia", "Germany"],
    product_categories: ["API Ingredients", "Generic Drugs", "Nutraceuticals", "Herbal Extracts"],
    min_order_value: 20000,
    min_order_currency: "USD",
    lead_time_days: 60,
    production_volume: "10 MT/month",
    featured: true,
    gst_number: "24AAACV4829B1ZF",
    description: "FDA-approved pharmaceutical manufacturer with WHO-GMP certification.",
    created_at: "2024-01-20",
    updated_at: "2024-12-10",
    status: "verified" as const,
    website: null, whatsapp: null, email: null, phone: null,
    user_id: null, stripe_customer_id: null, subscription_id: null, active_until: null,
    avg_rating: 4.9,
    review_count: 22,
  },
];

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

  // Filter demo data based on params (in production, this is a Supabase query)
  let filtered = [...DEMO_SUPPLIERS];
  if (q) {
    const search = q.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.industry.toLowerCase().includes(search) ||
        s.city.toLowerCase().includes(search) ||
        s.product_categories.some((c) => c.toLowerCase().includes(search))
    );
  }
  if (city) filtered = filtered.filter((s) => s.city === city);
  if (industry) filtered = filtered.filter((s) => s.industry === industry);
  if (tier) filtered = filtered.filter((s) => s.tier === tier);

  if (sort === "score")
    filtered.sort((a, b) => (b.verification_score ?? 0) - (a.verification_score ?? 0));
  else if (sort === "reviews")
    filtered.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
  else if (sort === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-ink mb-1">
            Verified Gujarat Suppliers
          </h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} verified supplier{filtered.length !== 1 ? "s" : ""} found
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
                <strong className="text-ink">{filtered.length}</strong>{" "}
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

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((supplier) => (
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
