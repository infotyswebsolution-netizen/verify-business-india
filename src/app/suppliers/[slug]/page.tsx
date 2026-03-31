import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Package,
  Globe,
  Clock,
  Box,
  Award,
  Calendar,
  AlertCircle,
  Share2,
  Bookmark,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { VerificationBadge, ScoreRing } from "@/components/ui/VerificationBadge";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Demo data — replace with Supabase query in production
const DEMO_SUPPLIER = {
  id: "1",
  name: "Shree Textile Mills",
  slug: "shree-textile-mills",
  city: "Surat",
  state: "Gujarat",
  industry: "Textiles & Fabrics",
  tier: "gold" as const,
  verification_score: 92,
  verified_at: "2024-12-01",
  export_capability: true,
  export_countries: ["USA", "Canada", "UK", "Germany", "France", "Australia"],
  product_categories: ["Synthetic Fabrics", "Sarees", "Dress Material", "Lace Fabric", "Georgette", "Chiffon"],
  min_order_value: 500,
  min_order_currency: "USD",
  lead_time_days: 21,
  production_volume: "50,000 meters/month",
  gst_number: "24AABCS1429B1ZC",
  description: `Shree Textile Mills is a leading manufacturer of premium synthetic fabrics based in Surat, Gujarat — India's textile capital. Established in 1985, we have 38 years of experience supplying high-quality fabrics to buyers across North America, Europe, and Australia.

Our state-of-the-art manufacturing facility spans 25,000 sq ft and employs 120 skilled workers. We operate modern Rapier looms capable of producing 50,000+ meters monthly with consistent quality standards.

We hold ISO 9001:2015 certification and comply with OEKO-TEX Standard 100 for chemical safety in textiles, making us the preferred choice for international buyers with strict compliance requirements.`,
  website: "https://shreetextilemills.com",
  whatsapp: "+91-98765-43210",
  email: "exports@shreetextilemills.com",
  phone: "+91-261-2345678",
  featured: true,
  photos: [
    { url: null, caption: "Main factory floor" },
    { url: null, caption: "Weaving department" },
    { url: null, caption: "Quality control lab" },
    { url: null, caption: "Finished goods warehouse" },
    { url: null, caption: "Export packing area" },
  ],
  certifications: [
    { type: "ISO 9001:2015", issuer: "Bureau Veritas", expiry_date: "2026-03-15", verified: true },
    { type: "GST Verified", issuer: "Government of India", expiry_date: null, verified: true },
    { type: "Export License", issuer: "DGFT India", expiry_date: "2025-12-31", verified: true },
    { type: "OEKO-TEX Standard 100", issuer: "OEKO-TEX Association", expiry_date: "2025-09-30", verified: true },
    { type: "MSME Registered", issuer: "Ministry of MSME", expiry_date: null, verified: true },
  ],
  audit_checklist: [
    { category: "Legal & Compliance", question: "Valid GST registration", status: "pass" },
    { category: "Legal & Compliance", question: "Export license current", status: "pass" },
    { category: "Legal & Compliance", question: "Factory license valid", status: "pass" },
    { category: "Legal & Compliance", question: "Labour compliance up to date", status: "pass" },
    { category: "Production Capacity", question: "Production volume verified", status: "pass" },
    { category: "Production Capacity", question: "Machinery list matches claim", status: "pass" },
    { category: "Production Capacity", question: "Minimum order ability confirmed", status: "pass" },
    { category: "Quality Systems", question: "Quality control process in place", status: "pass" },
    { category: "Quality Systems", question: "ISO certification verified", status: "pass" },
    { category: "Quality Systems", question: "Product testing capabilities", status: "pass" },
    { category: "Quality Systems", question: "Defect rate under 2%", status: "pass" },
    { category: "Worker Conditions", question: "Minimum wage compliance", status: "pass" },
    { category: "Worker Conditions", question: "Safe working environment", status: "pass" },
    { category: "Worker Conditions", question: "No child labour", status: "pass" },
    { category: "Worker Conditions", question: "Proper ventilation and fire safety", status: "pass" },
    { category: "Financial Health", question: "Bank account in business name", status: "pass" },
    { category: "Financial Health", question: "3 years of filed GST returns", status: "pass" },
    { category: "Financial Health", question: "Export history documented", status: "pass" },
    { category: "Infrastructure", question: "Dedicated export packing area", status: "pass" },
    { category: "Infrastructure", question: "Cold storage/climate control (if needed)", status: "na" },
    { category: "Infrastructure", question: "Internet & communication access", status: "pass" },
    { category: "Communication", question: "Responsive to international buyers", status: "pass" },
    { category: "Communication", question: "English communication capability", status: "partial" },
    { category: "Sustainability", question: "Wastewater treatment in place", status: "pass" },
    { category: "Sustainability", question: "Environmental compliance", status: "pass" },
  ],
  reviews: [
    {
      id: "r1",
      buyer_country: "Canada",
      company: "Nova Textiles Inc.",
      rating: 5,
      title: "Exceptional quality, reliable delivery",
      text: "We've sourced from Shree for 3 years. Consistent quality, good communication, and they've never missed a deadline. The verification report gave us confidence to place our first $40K order.",
      order_value: 45000,
      created_at: "2024-11-15",
    },
    {
      id: "r2",
      buyer_country: "USA",
      company: "Pacific Apparel LLC",
      rating: 5,
      title: "Best saree supplier we've found",
      text: "Tried 4 Indian suppliers before. Shree is the only one with documented quality processes. The OEKO-TEX cert was essential for our US retail customer requirements.",
      order_value: 28000,
      created_at: "2024-10-02",
    },
    {
      id: "r3",
      buyer_country: "UK",
      company: "Meridian Wholesale",
      rating: 4,
      title: "Good product, slight communication lag",
      text: "Quality is excellent and pricing is competitive. Response time on emails could be faster — took 48 hours sometimes. But the product delivered exactly as sampled.",
      order_value: 15000,
      created_at: "2024-08-20",
    },
  ],
};

const STATUS_ICON = {
  pass: <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />,
  fail: <XCircle size={16} className="text-red-500 flex-shrink-0" />,
  partial: <MinusCircle size={16} className="text-amber-500 flex-shrink-0" />,
  na: <MinusCircle size={16} className="text-gray-300 flex-shrink-0" />,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== DEMO_SUPPLIER.slug) return { title: "Supplier Not Found" };
  return {
    title: `${DEMO_SUPPLIER.name} — Verified ${DEMO_SUPPLIER.industry} Supplier in ${DEMO_SUPPLIER.city}`,
    description: `${DEMO_SUPPLIER.name} is a Gold-verified ${DEMO_SUPPLIER.industry} manufacturer in ${DEMO_SUPPLIER.city}, Gujarat. Verification score: ${DEMO_SUPPLIER.verification_score}/100. Exports to ${DEMO_SUPPLIER.export_countries.slice(0, 3).join(", ")}.`,
  };
}

export default async function SupplierProfilePage({ params }: PageProps) {
  const { slug } = await params;
  if (slug !== DEMO_SUPPLIER.slug) notFound();

  const supplier = DEMO_SUPPLIER;
  const avgRating =
    supplier.reviews.reduce((sum, r) => sum + r.rating, 0) /
    supplier.reviews.length;

  const checklistByCategory = supplier.audit_checklist.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof supplier.audit_checklist>
  );

  const passCount = supplier.audit_checklist.filter(
    (i) => i.status === "pass"
  ).length;

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const isExpiringSoon = (date: string | null) => {
    if (!date) return false;
    const d = new Date(date);
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    return d > new Date() && d <= threeMonths;
  };

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: supplier.name,
    description: supplier.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: supplier.city,
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: supplier.reviews.length,
      bestRating: 5,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-paper min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="text-sm text-gray-500 flex items-center gap-2">
              <Link href="/" className="hover:text-gold">Home</Link>
              <span>/</span>
              <Link href="/suppliers" className="hover:text-gold">Suppliers</Link>
              <span>/</span>
              <span className="text-ink font-medium">{supplier.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Hero Section */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <VerificationBadge tier={supplier.tier} size="md" />
                        <span className="text-sm text-gray-500">
                          Verified {supplier.verified_at ? formatDate(supplier.verified_at) : ""}
                        </span>
                      </div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-ink mb-2">
                        {supplier.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gold" />
                          {supplier.city}, Gujarat, India
                        </div>
                        <span>·</span>
                        <span>{supplier.industry}</span>
                        {supplier.export_capability && (
                          <>
                            <span>·</span>
                            <div className="flex items-center gap-1 text-trust font-medium">
                              <Globe size={14} />
                              Exports Globally
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <ScoreRing
                      score={supplier.verification_score}
                      tier={supplier.tier}
                      size={88}
                    />
                  </div>

                  {/* Reviews summary */}
                  {supplier.reviews.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= Math.round(avgRating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-200 fill-gray-200"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-ink">
                        {avgRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({supplier.reviews.length} verified buyer reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50">
                  <h2 className="font-bold text-ink text-lg">Factory Photos</h2>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {supplier.photos.map((photo, i) => (
                      <div
                        key={i}
                        className={`relative rounded-xl overflow-hidden bg-paper-dark ${
                          i === 0 ? "col-span-2 row-span-2 h-64" : "h-28"
                        }`}
                      >
                        {photo.url ? (
                          <Image
                            src={photo.url}
                            alt={photo.caption}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <Package size={i === 0 ? 40 : 24} className="text-gray-300" />
                            <span className="text-xs text-gray-400 text-center px-2">
                              {photo.caption}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-ink text-lg mb-4">About the Supplier</h2>
                <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                  {supplier.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-50">
                  <div className="text-center p-3 bg-paper rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Box size={14} className="text-gold" />
                      <span className="text-xs text-gray-500">Min. Order</span>
                    </div>
                    <span className="font-bold text-ink text-sm">
                      ${supplier.min_order_value?.toLocaleString()}{" "}
                      {supplier.min_order_currency}
                    </span>
                  </div>
                  <div className="text-center p-3 bg-paper rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock size={14} className="text-gold" />
                      <span className="text-xs text-gray-500">Lead Time</span>
                    </div>
                    <span className="font-bold text-ink text-sm">
                      {supplier.lead_time_days} days
                    </span>
                  </div>
                  <div className="text-center p-3 bg-paper rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award size={14} className="text-gold" />
                      <span className="text-xs text-gray-500">Volume</span>
                    </div>
                    <span className="font-bold text-ink text-sm text-center leading-tight">
                      {supplier.production_volume}
                    </span>
                  </div>
                  <div className="text-center p-3 bg-paper rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Globe size={14} className="text-gold" />
                      <span className="text-xs text-gray-500">Exports To</span>
                    </div>
                    <span className="font-bold text-ink text-sm">
                      {supplier.export_countries.length} countries
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-ink text-lg mb-4">Products & Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {supplier.product_categories.map((cat) => (
                    <span
                      key={cat}
                      className="bg-paper border border-paper-dark text-gray-700 text-sm px-3 py-1.5 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                {supplier.export_countries.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Export Destinations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {supplier.export_countries.map((country) => (
                        <span
                          key={country}
                          className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-full"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-ink text-lg mb-4">
                  Certifications & Licenses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {supplier.certifications.map((cert) => {
                    const expired = isExpired(cert.expiry_date);
                    const expiring = isExpiringSoon(cert.expiry_date);
                    return (
                      <div
                        key={cert.type}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${
                          expired
                            ? "bg-red-50 border-red-100"
                            : expiring
                            ? "bg-amber-50 border-amber-100"
                            : "bg-paper border-paper-dark"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {expired ? (
                            <AlertCircle size={16} className="text-red-500" />
                          ) : cert.verified ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <MinusCircle size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink">{cert.type}</p>
                          {cert.issuer && (
                            <p className="text-xs text-gray-500">{cert.issuer}</p>
                          )}
                          {cert.expiry_date && (
                            <p className={`text-xs mt-0.5 ${expired ? "text-red-600" : expiring ? "text-amber-600" : "text-gray-400"}`}>
                              <Calendar size={10} className="inline mr-1" />
                              {expired ? "Expired" : "Expires"}{" "}
                              {formatDate(cert.expiry_date)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 25-Point Audit Checklist */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-ink text-lg">
                    Verification Audit Report
                  </h2>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {passCount}/{supplier.audit_checklist.filter(i => i.status !== "na").length} Passed
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  25-point physical factory inspection conducted by our Gujarat-based audit team.
                </p>

                <div className="space-y-5">
                  {Object.entries(checklistByCategory).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {category}
                      </h3>
                      <div className="space-y-1.5">
                        {items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-paper transition-colors"
                          >
                            {STATUS_ICON[item.status as keyof typeof STATUS_ICON]}
                            <span
                              className={`text-sm flex-1 ${
                                item.status === "na" ? "text-gray-400" : "text-gray-700"
                              }`}
                            >
                              {item.question}
                            </span>
                            {item.status === "partial" && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                Partial
                              </span>
                            )}
                            {item.status === "na" && (
                              <span className="text-xs text-gray-400">N/A</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buyer Reviews */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-ink text-lg">Buyer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= Math.round(avgRating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold text-ink">
                      {avgRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({supplier.reviews.length})
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  {supplier.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-50 last:border-0 pb-5 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  className={
                                    s <= review.rating
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-gray-200 fill-gray-200"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                          <p className="font-semibold text-sm text-ink">
                            {review.title}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-trust">
                            {review.buyer_country}
                          </div>
                          {review.order_value && (
                            <div className="text-xs text-gray-400">
                              Order: ${review.order_value.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {review.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        — {review.company}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Contact Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <ScoreRing
                      score={supplier.verification_score}
                      tier={supplier.tier}
                      size={56}
                    />
                    <div>
                      <VerificationBadge tier={supplier.tier} size="sm" />
                      <p className="text-xs text-gray-500 mt-1">
                        Last audited {supplier.verified_at ? formatDate(supplier.verified_at) : ""}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/inquiry/${supplier.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-trust text-white font-bold py-3 rounded-xl hover:bg-trust/90 transition-colors mb-3"
                  >
                    <MessageSquare size={16} />
                    Send Inquiry
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:border-gold hover:text-gold transition-colors text-sm font-medium">
                      <Bookmark size={14} />
                      Save
                    </button>
                    <button className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:border-gold hover:text-gold transition-colors text-sm font-medium">
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
                    {supplier.email && (
                      <a
                        href={`mailto:${supplier.email}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-trust transition-colors"
                      >
                        <ExternalLink size={13} className="flex-shrink-0" />
                        {supplier.email}
                      </a>
                    )}
                    {supplier.website && (
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-trust transition-colors"
                      >
                        <Globe size={13} className="flex-shrink-0" />
                        Visit Website
                      </a>
                    )}
                    <p className="text-xs text-gray-400">
                      GST: {supplier.gst_number}
                    </p>
                  </div>
                </div>

                {/* Buy Audit Report */}
                <div className="bg-gradient-to-br from-trust to-trust-light rounded-2xl p-5 text-white">
                  <h3 className="font-bold text-base mb-1">Get the Full Audit Report</h3>
                  <p className="text-white/80 text-xs mb-4">
                    Download the complete 25-point audit PDF with photos, scores,
                    and auditor notes.
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: "Basic Report", price: "$299", points: "15-point checklist + photos" },
                      { name: "Standard Report", price: "$499", points: "Full 25-point + financials" },
                      { name: "Premium Report", price: "$999", points: "Full audit + video walkthrough" },
                    ].map((plan) => (
                      <button
                        key={plan.name}
                        className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2.5 transition-colors text-left"
                      >
                        <div>
                          <div className="font-semibold text-sm">{plan.name}</div>
                          <div className="text-xs text-white/70">{plan.points}</div>
                        </div>
                        <span className="font-bold text-gold text-sm">{plan.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-ink text-sm mb-3">Quick Facts</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: "Min. Order", value: `$${supplier.min_order_value?.toLocaleString()} ${supplier.min_order_currency}` },
                      { label: "Lead Time", value: `${supplier.lead_time_days} days` },
                      { label: "Capacity", value: supplier.production_volume || "—" },
                      { label: "Exports To", value: `${supplier.export_countries.length} countries` },
                      { label: "Certifications", value: `${supplier.certifications.length} verified` },
                    ].map((fact) => (
                      <div key={fact.label} className="flex justify-between gap-2">
                        <span className="text-gray-500">{fact.label}</span>
                        <span className="font-medium text-ink text-right">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
