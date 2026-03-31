import Link from "next/link";
import {
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe,
  Building2,
  TrendingUp,
  Users,
  Package,
  Gem,
  Wrench,
  FlaskConical,
  Shirt,
} from "lucide-react";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

const STATS = [
  { value: "500+", label: "Verified Suppliers", icon: ShieldCheck },
  { value: "35K+", label: "Gujarat SMEs Reachable", icon: Building2 },
  { value: "$8B+", label: "Canada-India Trade", icon: TrendingUp },
  { value: "50+", label: "Countries Served", icon: Globe },
];

const INDUSTRIES = [
  {
    icon: Shirt,
    name: "Textiles & Fabrics",
    city: "Surat",
    count: "120+ suppliers",
    href: "/industries/textiles",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Gem,
    name: "Diamonds & Gems",
    city: "Surat",
    count: "80+ suppliers",
    href: "/industries/diamonds",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Wrench,
    name: "Metals & Welding",
    city: "Rajkot",
    count: "150+ suppliers",
    href: "/industries/metals",
    color: "bg-slate-50 text-slate-600",
  },
  {
    icon: FlaskConical,
    name: "Chemicals",
    city: "Ahmedabad",
    count: "90+ suppliers",
    href: "/industries/chemicals",
    color: "bg-green-50 text-green-700",
  },
  {
    icon: Package,
    name: "Pharmaceuticals",
    city: "Ahmedabad",
    count: "60+ suppliers",
    href: "/industries/pharmaceuticals",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Building2,
    name: "Engineering",
    city: "Rajkot",
    count: "100+ suppliers",
    href: "/industries/engineering",
    color: "bg-orange-50 text-orange-600",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Supplier Applies",
    description:
      "Gujarat manufacturers apply and submit their GST registration, export licenses, and factory documents.",
  },
  {
    step: "02",
    title: "Physical Audit",
    description:
      "Our Gujarat-based auditors conduct a 25-point factory inspection — capacity, quality systems, worker conditions.",
  },
  {
    step: "03",
    title: "Score & Badge",
    description:
      "Supplier receives a verified score (1–100) and Bronze, Silver, or Gold badge based on audit results.",
  },
  {
    step: "04",
    title: "Buyer Connects",
    description:
      "Western buyers browse verified profiles, download audit reports, and connect with full confidence.",
  },
];

const TRUST_POINTS = [
  "25-point factory audit by on-ground Gujarat agents",
  "GST verification + export license checks",
  "Factory photos & video walkthroughs",
  "Buyer reviews from verified purchases",
  "Canada-registered entity — legally contract with us",
  "Re-verified every 6–12 months",
];

const FEATURED_SUPPLIERS = [
  {
    id: "1",
    name: "Shree Textile Mills",
    slug: "shree-textile-mills",
    city: "Surat",
    industry: "Textiles",
    tier: "gold" as const,
    score: 92,
    reviews: 18,
    rating: 4.8,
    export: true,
    categories: ["Synthetic Fabrics", "Sarees", "Dress Material"],
  },
  {
    id: "2",
    name: "Rajkot Precision Engineering",
    slug: "rajkot-precision-engineering",
    city: "Rajkot",
    industry: "Metals",
    tier: "gold" as const,
    score: 88,
    reviews: 12,
    rating: 4.9,
    export: true,
    categories: ["CNC Components", "Castings", "Auto Parts"],
  },
  {
    id: "3",
    name: "Diamond Star Exports",
    slug: "diamond-star-exports",
    city: "Surat",
    industry: "Diamonds",
    tier: "silver" as const,
    score: 79,
    reviews: 7,
    rating: 4.6,
    export: true,
    categories: ["Brilliant Cut", "Princess Cut", "Loose Diamonds"],
  },
];

export default function HomePage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ink to-trust min-h-[600px] flex items-center">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2D7A5F 0%, transparent 50%)`
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <ShieldCheck size={14} className="text-gold" />
              Canada-registered · Gujarat ground access · Western-standard audits
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Find Verified{" "}
              <span className="gradient-gold">Gujarat Suppliers</span>{" "}
              You Can Actually Trust
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-2xl leading-relaxed">
              Every supplier is physically audited by our Gujarat-based team.
              Detailed factory reports. Verified certifications. The trust layer
              IndiaMART never built.
            </p>

            {/* Search Bar */}
            <form
              action="/suppliers"
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="q"
                  type="text"
                  placeholder="Search by product, industry, or city..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold text-base shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-3.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg whitespace-nowrap"
              >
                Find Suppliers
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {["Textiles", "Diamonds", "Welding", "Chemicals", "Pharma"].map(
                (tag) => (
                  <Link
                    key={tag}
                    href={`/suppliers?industry=${tag.toLowerCase()}`}
                    className="text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 transition-colors"
                  >
                    {tag}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-ink mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-ink mb-3">
            Browse by Industry
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Deep-rooted in Gujarat&apos;s industrial clusters. Every verified supplier
            is mapped to their city and specialty.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;
            return (
              <Link
                key={industry.name}
                href={industry.href}
                className="group flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 hover:border-gold/40 hover:shadow-md transition-all text-center"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${industry.color}`}
                >
                  <Icon size={22} />
                </div>
                <span className="text-sm font-semibold text-ink group-hover:text-trust leading-tight mb-1">
                  {industry.name}
                </span>
                <span className="text-xs text-gray-400">{industry.city}</span>
                <span className="text-xs text-gold font-medium mt-1">
                  {industry.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-ink mb-1">
                Featured Verified Suppliers
              </h2>
              <p className="text-gray-500">Top-rated, gold-audited manufacturers</p>
            </div>
            <Link
              href="/suppliers"
              className="hidden sm:flex items-center gap-2 text-trust font-semibold hover:gap-3 transition-all text-sm"
            >
              View all suppliers <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_SUPPLIERS.map((supplier) => (
              <Link
                key={supplier.id}
                href={`/suppliers/${supplier.slug}`}
                className="group bg-paper rounded-2xl border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="h-44 bg-gradient-to-br from-paper to-paper-dark flex items-center justify-center">
                  <Package size={40} className="text-gray-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-ink group-hover:text-trust transition-colors leading-tight">
                      {supplier.name}
                    </h3>
                    <VerificationBadge tier={supplier.tier} size="sm" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <span>{supplier.city}</span>
                    <span>·</span>
                    <span>{supplier.industry}</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-medium">
                      Score: {supplier.score}/100
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {supplier.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600 border"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="font-semibold">{supplier.rating}</span>
                      <span className="text-gray-400">({supplier.reviews} reviews)</span>
                    </div>
                    <span className="text-trust font-medium">Exports Globally</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/suppliers"
              className="inline-flex items-center gap-2 text-trust font-semibold"
            >
              View all suppliers <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ink mb-3">
            How Verification Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Our 4-step process ensures every listed supplier meets
            Western-standard quality benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="relative">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gold/40 to-transparent -z-0" />
              )}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-trust flex items-center justify-center mb-4">
                  <span className="text-gold font-bold text-xl">{step.step}</span>
                </div>
                <h3 className="font-bold text-ink text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 bg-trust text-white font-semibold px-6 py-3 rounded-xl hover:bg-trust/90 transition-colors"
          >
            Learn about the audit process <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-ink py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Buyers Trust{" "}
                <span className="gradient-gold">VerifyIndia</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Western buyers lose $50K–$500K annually on bad India sourcing.
                Our Canada-registered platform with Gujarat ground access is the
                trust layer that didn&apos;t exist — until now.
              </p>
              <ul className="space-y-3">
                {TRUST_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-gold flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-300 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Average order protected",
                  value: "$50K+",
                  sub: "per transaction",
                },
                {
                  label: "Audit report cost",
                  value: "$299",
                  sub: "one-time per supplier",
                },
                {
                  label: "Supplier verification score",
                  value: "25-pt",
                  sub: "checklist audit",
                },
                {
                  label: "Buyer satisfaction",
                  value: "98%",
                  sub: "verified reviews",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <div className="text-3xl font-bold text-gold mb-1">
                    {card.value}
                  </div>
                  <div className="text-xs text-gray-400">{card.sub}</div>
                  <div className="text-sm text-gray-300 mt-2">{card.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — For Suppliers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-trust to-trust-light rounded-3xl p-10 lg:p-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white rounded-full px-4 py-1.5 text-sm mb-5">
            <Users size={14} />
            For Gujarat Suppliers
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Get Your Factory Verified.<br />Reach Western Buyers.
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            Join 500+ Gujarat manufacturers already listed. Free basic profile,
            or go Gold for maximum visibility to international buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup?role=supplier"
              className="bg-white text-trust font-bold px-8 py-3.5 rounded-xl hover:bg-paper transition-colors text-base"
            >
              Create Free Listing
            </Link>
            <Link
              href="/pricing"
              className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
