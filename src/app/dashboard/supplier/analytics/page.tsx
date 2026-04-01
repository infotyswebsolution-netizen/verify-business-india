import { Metadata } from "next";
import { BarChart3, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Analytics" };

export default function SupplierAnalyticsPage() {
  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-ink mb-1">Analytics</h1>
        <p className="text-gray-500 text-sm mb-8">Track your profile performance and buyer engagement.</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={28} className="text-purple-500" />
          </div>
          <h2 className="text-lg font-bold text-ink mb-2">Analytics coming soon</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-4">
            Profile view counts, buyer countries, inquiry conversion rates, and search ranking data.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
            <Clock size={14} />
            Available in a future update
          </div>
        </div>
      </div>
    </div>
  );
}
