import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, X, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Supplier Verification Plans",
  description:
    "Affordable supplier verification plans for Gujarat manufacturers. Bronze ₹8,000/yr, Silver ₹20,000/yr, Gold ₹45,000/yr. Plus buyer audit reports from $299.",
};

const SUPPLIER_PLANS = [
  {
    id: "bronze",
    name: "Bronze",
    priceINR: "₹8,000",
    priceUSD: "$95",
    period: "/year",
    tagline: "Start building trust",
    color: "border-orange-200",
    headerBg: "bg-orange-50",
    badgeColor: "text-orange-700 bg-orange-100",
    ctaClass: "bg-gray-800 hover:bg-gray-700 text-white",
    features: [
      { text: "Basic verified listing", included: true },
      { text: "Bronze verification badge", included: true },
      { text: "1 factory audit per year", included: true },
      { text: "Up to 10 factory photos", included: true },
      { text: "Buyer inquiry access", included: true },
      { text: "GST & license verification", included: true },
      { text: "Profile analytics", included: false },
      { text: "Priority search placement", included: false },
      { text: "Featured on homepage", included: false },
      { text: "See buyer details first", included: false },
    ],
  },
  {
    id: "silver",
    name: "Silver",
    priceINR: "₹20,000",
    priceUSD: "$240",
    period: "/year",
    tagline: "Grow international sales",
    popular: true,
    color: "border-slate-300",
    headerBg: "bg-slate-50",
    badgeColor: "text-slate-700 bg-slate-100",
    ctaClass: "bg-trust hover:bg-trust/90 text-white",
    features: [
      { text: "Full verified profile", included: true },
      { text: "Silver verification badge + score", included: true },
      { text: "2 factory audits per year", included: true },
      { text: "Up to 20 factory photos", included: true },
      { text: "Buyer inquiry access", included: true },
      { text: "GST & license verification", included: true },
      { text: "Profile analytics dashboard", included: true },
      { text: "Priority in search results", included: true },
      { text: "Featured on homepage", included: false },
      { text: "See buyer details first", included: false },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    priceINR: "₹45,000",
    priceUSD: "$540",
    period: "/year",
    tagline: "Maximum buyer visibility",
    color: "border-amber-300",
    headerBg: "bg-amber-50",
    badgeColor: "text-amber-700 bg-amber-100",
    ctaClass: "bg-gold hover:bg-gold-dark text-white",
    features: [
      { text: "Premium featured profile", included: true },
      { text: "Gold badge + top placement", included: true },
      { text: "4 factory audits per year", included: true },
      { text: "Unlimited factory photos", included: true },
      { text: "Buyer inquiry access", included: true },
      { text: "GST & license verification", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Featured on homepage", included: true },
      { text: "See buyer details first", included: true },
      { text: "Priority email support", included: true },
    ],
  },
];

const BUYER_REPORTS = [
  {
    name: "Basic Report",
    price: "$299",
    description: "15-point checklist, factory photos, GST verification. Perfect for initial supplier screening.",
    features: [
      "15-point checklist audit",
      "Factory photo documentation",
      "GST & license verification",
      "Basic capacity assessment",
      "PDF report download",
    ],
    cta: "Order Basic Report",
    recommended: false,
  },
  {
    name: "Standard Report",
    price: "$499",
    description: "Full 25-point audit with financial health check. Recommended for orders over $20K.",
    features: [
      "Full 25-point factory audit",
      "Financial health check",
      "Export history review",
      "Quality system assessment",
      "Worker condition check",
      "PDF report download",
    ],
    cta: "Order Standard Report",
    recommended: true,
  },
  {
    name: "Premium Report",
    price: "$999",
    description: "Complete due diligence with video walkthrough and QC sample. For high-value orders.",
    features: [
      "Everything in Standard",
      "Video factory walkthrough",
      "QC sample testing",
      "Management interview",
      "Competitive comparison",
      "30-day follow-up call",
    ],
    cta: "Order Premium Report",
    recommended: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-ink to-trust py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-5">
            <ShieldCheck size={14} className="text-gold" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Pricing for Suppliers & Buyers
          </h1>
          <p className="text-white/70 text-lg">
            Suppliers pay for verification. Buyers pay for audit reports. The
            business is profitable from the very first subscription.
          </p>
        </div>
      </div>

      {/* Supplier Plans */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-ink mb-2">
            For Gujarat Suppliers
          </h2>
          <p className="text-gray-500">
            Annual plans in INR. Get verified, get found, get orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUPPLIER_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 ${plan.color} overflow-hidden ${
                plan.popular ? "shadow-xl ring-2 ring-trust/20" : "shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-trust text-white text-xs font-bold text-center py-1.5">
                  MOST POPULAR
                </div>
              )}

              <div className={`p-6 ${plan.headerBg} ${plan.popular ? "pt-10" : ""}`}>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.badgeColor} uppercase tracking-wider`}
                >
                  {plan.name}
                </span>
                <div className="mt-3 mb-1">
                  <span className="text-3xl font-bold text-ink">{plan.priceINR}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-xs text-gray-500">
                  ≈ {plan.priceUSD} USD/year
                </p>
                <p className="text-sm text-gray-600 mt-2">{plan.tagline}</p>
              </div>

              <div className="p-6">
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-start gap-2.5"
                    >
                      {feature.included ? (
                        <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={15} className="text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/auth/signup?role=supplier&plan=${plan.id}`}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors ${plan.ctaClass}`}
                >
                  Get {plan.name} Plan
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          All plans include a 7-day free trial. Cancel anytime. GST applicable for Indian businesses.
        </p>
      </section>

      {/* Buyer Audit Reports */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink mb-2">
              For International Buyers
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Order a detailed audit report for any supplier. One-time payment.
              Protection for large orders. Typical buyers save $50K+ in bad
              sourcing costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUYER_REPORTS.map((report) => (
              <div
                key={report.name}
                className={`relative bg-paper rounded-2xl border ${
                  report.recommended
                    ? "border-trust shadow-lg"
                    : "border-gray-100"
                } p-6`}
              >
                {report.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-trust text-white text-xs font-bold px-4 py-1 rounded-full">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-ink mb-0.5">
                    {report.name}
                  </h3>
                  <div className="text-3xl font-bold text-gold">
                    {report.price}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {report.description}
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {report.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/auth/signup?role=buyer`}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl transition-colors text-sm ${
                    report.recommended
                      ? "bg-trust text-white hover:bg-trust/90"
                      : "bg-ink text-white hover:bg-ink/80"
                  }`}
                >
                  {report.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-ink text-center mb-8">
          Common Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "How long does verification take?",
              a: "Bronze takes 5–7 business days. Silver takes 10–14 days. Gold takes 15–21 days due to the more thorough audit process.",
            },
            {
              q: "Who conducts the physical audits?",
              a: "Our Gujarat-based audit team. We have trained auditors in Surat, Rajkot, Ahmedabad, and Vadodara who conduct in-person factory visits.",
            },
            {
              q: "Can I upgrade my plan?",
              a: "Yes. Upgrade anytime through your supplier dashboard. You'll be pro-rated for the remaining period.",
            },
            {
              q: "What currency do you accept?",
              a: "INR via UPI, NEFT, or bank transfer for India-based suppliers. USD via Stripe credit card or bank transfer for international payments.",
            },
            {
              q: "What if I disagree with my audit score?",
              a: "You can request a re-audit within 30 days at no extra cost. We'll send a different auditor for a second opinion.",
            },
          ].map((item) => (
            <div
              key={item.q}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <h3 className="font-semibold text-ink mb-2">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
