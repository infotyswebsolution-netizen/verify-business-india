import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources & Blog — VerifyIndia",
  description:
    "Guides, insights, and practical advice for Western buyers sourcing from Gujarat, India. Learn how verification works, understand GST, and navigate Indian manufacturing.",
};

const POSTS = [
  {
    slug: "how-to-source-from-gujarat",
    title: "How to Source from Gujarat: A Western Buyer's Guide",
    excerpt:
      "Gujarat accounts for over 40% of India's exports. Here's everything a first-time international buyer needs to know — from which cities specialize in what, to how to vet a supplier before placing an order.",
    readTime: "8 min read",
    category: "Sourcing Guide",
    date: "March 2026",
  },
  {
    slug: "understanding-gst-verification-india",
    title: "Understanding GST Verification in India",
    excerpt:
      "India's Goods and Services Tax (GST) number is the single most important document to verify when working with an Indian supplier. This guide explains what it is, how to read it, and how to check it independently.",
    readTime: "5 min read",
    category: "Due Diligence",
    date: "February 2026",
  },
  {
    slug: "what-our-25-point-audit-checks",
    title: "What Our 25-Point Audit Actually Checks",
    excerpt:
      "Our field auditors visit every supplier before they appear on the platform. This post walks through all 25 checkpoints — from factory registration documents to production line capacity — and explains why each one matters.",
    readTime: "6 min read",
    category: "Verification",
    date: "January 2026",
  },
  {
    slug: "incoterms-for-india-imports",
    title: "Incoterms for India Imports: FOB vs CIF Explained",
    excerpt:
      "Choosing the wrong Incoterm can cost you thousands in unexpected freight and insurance costs. We break down the four most common terms used in India-to-Canada/US/UK trade and when to use each.",
    readTime: "7 min read",
    category: "Logistics",
    date: "December 2025",
  },
  {
    slug: "gujarat-textile-industry-overview",
    title: "Gujarat Textile Industry: The Complete Buyer Overview",
    excerpt:
      "Surat alone produces 40% of India's synthetic fabric. This overview covers the major manufacturing clusters, typical MOQs, lead times, and what certifications to look for when sourcing fabrics from Gujarat.",
    readTime: "10 min read",
    category: "Industry Guide",
    date: "November 2025",
  },
  {
    slug: "avoiding-common-india-sourcing-mistakes",
    title: "5 Sourcing Mistakes Western Buyers Make in India",
    excerpt:
      "From skipping factory visits to misunderstanding payment terms, these are the most common — and expensive — mistakes we see international buyers make when sourcing from Indian manufacturers for the first time.",
    readTime: "6 min read",
    category: "Sourcing Guide",
    date: "October 2025",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Sourcing Guide": "bg-blue-50 text-blue-700 border-blue-100",
  "Due Diligence": "bg-amber-50 text-amber-700 border-amber-100",
  "Verification": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Logistics": "bg-purple-50 text-purple-700 border-purple-100",
  "Industry Guide": "bg-orange-50 text-orange-700 border-orange-100",
};

export default function ResourcesPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-trust/10 flex items-center justify-center">
              <BookOpen size={20} className="text-trust" />
            </div>
            <h1 className="text-3xl font-bold text-ink">Resources & Blog</h1>
          </div>
          <p className="text-gray-500 max-w-xl">
            Practical guides for Western buyers sourcing from Gujarat, India.
            No fluff — just what you need to source smarter and safer.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Featured Post */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gold/30 hover:shadow-sm transition-all">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[featured.category] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                <Tag size={10} className="inline mr-1" />
                {featured.category}
              </span>
              <span className="text-xs text-gray-400">{featured.date}</span>
            </div>
            <h2 className="text-2xl font-bold text-ink mb-3">{featured.title}</h2>
            <p className="text-gray-600 leading-relaxed mb-5 max-w-2xl">{featured.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock size={13} />
                {featured.readTime}
              </div>
              <Link
                href={`/resources/${featured.slug}`}
                className="inline-flex items-center gap-2 text-trust font-semibold text-sm hover:gap-3 transition-all"
              >
                Read Article <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <div
              key={post.slug}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col hover:border-gold/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[post.category] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {post.category}
                </span>
              </div>
              <h3 className="font-bold text-ink mb-2 leading-snug">{post.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
                {post.excerpt.slice(0, 120)}…
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={11} />
                  {post.readTime}
                </div>
                <Link
                  href={`/resources/${post.slug}`}
                  className="text-xs text-trust font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Read <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-br from-trust to-trust/80 rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Get new guides in your inbox</h2>
          <p className="text-white/80 text-sm mb-6">
            Monthly sourcing insights for Western buyers. No spam — just practical India trade knowledge.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-trust font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm"
          >
            Subscribe via Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}
