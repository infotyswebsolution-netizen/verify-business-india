import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Camera,
  FileText,
  Star,
  Shield,
  Building2,
  Users,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How Supplier Verification Works",
  description:
    "Learn about VerifyIndia's 25-point factory audit process. How we physically inspect Gujarat manufacturers and issue Bronze, Silver, Gold verification badges.",
};

const AUDIT_CATEGORIES = [
  {
    icon: Shield,
    category: "Legal & Compliance",
    color: "bg-blue-50 text-blue-600",
    checks: [
      "GST registration validity",
      "Export license current status",
      "Factory license verification",
      "Labour law compliance",
    ],
  },
  {
    icon: Building2,
    category: "Production Capacity",
    color: "bg-orange-50 text-orange-600",
    checks: [
      "Machinery list cross-check",
      "Monthly capacity verification",
      "Minimum order ability",
      "Worker headcount",
    ],
  },
  {
    icon: ClipboardList,
    category: "Quality Systems",
    color: "bg-emerald-50 text-emerald-600",
    checks: [
      "QC process documentation",
      "ISO certification check",
      "Product testing setup",
      "Defect rate measurement",
    ],
  },
  {
    icon: Users,
    category: "Worker Conditions",
    color: "bg-purple-50 text-purple-600",
    checks: [
      "Minimum wage compliance",
      "Safe working environment",
      "No child labour confirmation",
      "Fire safety measures",
    ],
  },
  {
    icon: FileText,
    category: "Financial Health",
    color: "bg-indigo-50 text-indigo-600",
    checks: [
      "Business bank account verification",
      "3-year GST return history",
      "Export invoice documentation",
      "No major legal disputes",
    ],
  },
  {
    icon: Camera,
    category: "Documentation",
    color: "bg-amber-50 text-amber-600",
    checks: [
      "20+ factory photo set",
      "Video walkthrough (Gold only)",
      "Management interview notes",
      "Equipment serial verification",
    ],
  },
];

const TIER_THRESHOLDS = [
  {
    tier: "Bronze",
    range: "60–74",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    badge: "bg-orange-100",
    description: "Passes basic legal, capacity, and compliance checks. Suitable for low-risk sourcing relationships.",
  },
  {
    tier: "Silver",
    range: "75–89",
    color: "bg-slate-50 border-slate-200 text-slate-700",
    badge: "bg-slate-100",
    description: "Strong across quality systems and financial health. Recommended for orders over $5K.",
  },
  {
    tier: "Gold",
    range: "90–100",
    color: "bg-amber-50 border-amber-300 text-amber-700",
    badge: "bg-amber-100",
    description: "Highest standard. Excellent quality systems, documented processes, and strong buyer history. Suitable for all order sizes.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-ink to-trust py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            How Supplier Verification Works
          </h1>
          <p className="text-white/70 text-lg">
            Every VerifyIndia badge represents a real physical factory visit by
            our Gujarat audit team. Here&apos;s exactly what we check — and how we
            score it.
          </p>
        </div>
      </div>

      {/* 4-Step Process */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-ink text-center mb-10">
          The 4-Step Verification Process
        </h2>

        <div className="space-y-6">
          {[
            {
              step: "01",
              title: "Supplier Application",
              duration: "Day 1",
              description:
                "The supplier fills out our detailed onboarding form: company info, GST number, factory address, product categories, export history, and uploads initial documents (GST certificate, export license, any existing certifications).",
              points: [
                "Basic info and factory location",
                "Document upload (GST, licenses)",
                "Product and capacity declaration",
                "Payment for chosen plan tier",
              ],
            },
            {
              step: "02",
              title: "Document Review & Audit Scheduling",
              duration: "Days 2–5",
              description:
                "Our team reviews submitted documents and assigns a local Gujarat auditor. The auditor contacts the supplier to schedule a convenient factory visit. We match auditors by geography — Surat auditors for Surat factories, Rajkot auditors for Rajkot.",
              points: [
                "Document authenticity check",
                "Auditor assignment (city-matched)",
                "Factory visit scheduled",
                "Supplier briefed on what to prepare",
              ],
            },
            {
              step: "03",
              title: "Physical Factory Audit",
              duration: "Days 6–14",
              description:
                "Our auditor spends 3–5 hours on-site completing the 25-point checklist. They photograph the facility, machinery, quality control areas, and finished goods. For Gold audits, they also conduct a video walkthrough.",
              points: [
                "25-point physical inspection",
                "20+ factory photographs taken",
                "Management interview conducted",
                "Documents cross-verified on-site",
              ],
            },
            {
              step: "04",
              title: "Score, Badge & Report",
              duration: "Days 15–21",
              description:
                "Our team reviews the auditor's findings, assigns a score from 1–100, and issues the appropriate badge (Bronze/Silver/Gold). The supplier's profile goes live with the badge. A detailed PDF report is generated and available for purchase by buyers.",
              points: [
                "Score calculated (1–100 scale)",
                "Badge tier assigned",
                "Profile made public with badge",
                "Audit report PDF available to buyers",
              ],
            },
          ].map((step, i) => (
            <div
              key={step.step}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-trust flex items-center justify-center">
                  <span className="text-gold font-bold text-xl">{step.step}</span>
                </div>
                {i < 3 && (
                  <div className="w-0.5 h-8 bg-gray-200 mx-auto mt-2" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-ink text-lg">{step.title}</h3>
                  <span className="text-xs text-gold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                    {step.duration}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {step.description}
                </p>
                <ul className="space-y-1">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 25-Point Checklist */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink mb-2">
              The 25-Point Audit Checklist
            </h2>
            <p className="text-gray-500">
              Six categories. 25 items. Every item is pass/fail/partial — no
              vague assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AUDIT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.category}
                  className="bg-paper rounded-2xl border border-gray-100 p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="font-bold text-ink text-sm">{cat.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {cat.checks.map((check) => (
                      <li key={check} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scoring & Badge Tiers */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-ink mb-2">
            Scoring & Badge Thresholds
          </h2>
          <p className="text-gray-500">
            Each audit item is scored on a 4-point scale. Bronze/Silver/Gold is
            determined by the final score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIER_THRESHOLDS.map((tier) => (
            <div
              key={tier.tier}
              className={`rounded-2xl border-2 p-5 ${tier.color}`}
            >
              <div className={`inline-block text-sm font-bold px-3 py-1 rounded-full mb-3 ${tier.badge}`}>
                {tier.tier} Tier
              </div>
              <div className="text-3xl font-bold mb-1">{tier.range}</div>
              <div className="text-sm font-medium mb-2">out of 100 points</div>
              <p className="text-sm opacity-80 leading-relaxed">
                {tier.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 text-sm text-gray-600">
          <strong className="text-ink">Scores below 60:</strong> Supplier is not
          listed. We notify them of specific gaps and they can re-apply after 90
          days once improvements are made. This is how we maintain quality — we
          turn down roughly 30% of applicants.
        </div>
      </section>

      {/* Re-verification */}
      <section className="bg-ink py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Star size={36} className="text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Re-Verification Keeps Badges Current
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            Bronze suppliers are re-audited annually. Silver gets re-audited
            every 6 months. Gold gets quarterly check-ins. Badges that haven&apos;t
            been re-verified are marked as &quot;Renewal Pending&quot; on the profile —
            keeping buyers fully informed.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            View Supplier Pricing
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
