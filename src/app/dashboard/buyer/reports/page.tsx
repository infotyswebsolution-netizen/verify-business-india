import { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, ArrowRight, Lock } from "lucide-react";

export const metadata: Metadata = { title: "Audit Reports" };

const REPORT_FEATURES = [
  "25-point physical factory audit",
  "Photo evidence of facility and equipment",
  "Financial stability check",
  "Worker capacity & compliance assessment",
  "Export readiness verification",
  "PDF report delivered within 7 business days",
];

export default function ReportsPage() {
  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-ink mb-1">Audit Reports</h1>
        <p className="text-gray-500 text-sm mb-8">
          Purchase detailed audit reports for suppliers you&apos;re evaluating.
        </p>

        {/* Empty state card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-purple-500" />
          </div>
          <h2 className="text-lg font-bold text-ink mb-2">No reports yet</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-6">
            Order a deep-dive audit report on any supplier before placing a
            large order. Physical inspection by our Gujarat-based auditors.
          </p>
          <Link
            href="/suppliers"
            className="inline-flex items-center gap-2 bg-trust text-white font-bold px-6 py-3 rounded-xl hover:bg-trust/90 transition-colors"
          >
            Find a Supplier to Audit
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* What's included */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-trust" />
            <h3 className="font-bold text-ink">What&apos;s included in every audit report</h3>
          </div>
          <ul className="space-y-2.5">
            {REPORT_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={11} className="text-emerald-500" />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-5 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
            <Lock size={12} />
            <span>
              Reports are only visible to the buyer who purchased them.
            </span>
          </div>
        </div>

        {/* Pricing hint */}
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-600 font-bold text-sm">$</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-0.5">
              Audit reports from $299 USD
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              One-time purchase per supplier. Available on the supplier&apos;s
              profile page once Stripe payments are connected.
            </p>
            <Link
              href="/pricing"
              className="inline-block mt-2 text-xs text-amber-800 font-semibold hover:underline"
            >
              View pricing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
