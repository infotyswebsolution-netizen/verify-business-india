import { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Bookmark,
  MessageSquare,
  FileText,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Buyer Dashboard",
};

const QUICK_ACTIONS = [
  {
    icon: Search,
    title: "Find Suppliers",
    description: "Browse 500+ verified Gujarat manufacturers",
    href: "/suppliers",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Bookmark,
    title: "Saved Suppliers",
    description: "View your shortlisted suppliers",
    href: "/dashboard/buyer/saved",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: MessageSquare,
    title: "My Inquiries",
    description: "Track active contact requests",
    href: "/dashboard/buyer/inquiries",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: FileText,
    title: "Audit Reports",
    description: "Download purchased audit reports",
    href: "/dashboard/buyer/reports",
    color: "bg-purple-50 text-purple-600",
  },
];

const RECENT_ACTIVITY = [
  {
    type: "inquiry_accepted",
    message: "Shree Textile Mills accepted your inquiry",
    time: "2 hours ago",
    supplier: "Shree Textile Mills",
    href: "/dashboard/buyer/inquiries",
  },
  {
    type: "report_ready",
    message: "Audit report for Rajkot Precision Engineering is ready",
    time: "Yesterday",
    supplier: "Rajkot Precision Engineering",
    href: "/dashboard/buyer/reports",
  },
  {
    type: "new_supplier",
    message: "New Gold-verified supplier in Surat textiles",
    time: "2 days ago",
    supplier: null,
    href: "/suppliers?city=Surat&industry=textiles",
  },
];

export default function BuyerDashboardPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">Buyer Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Find, shortlist, and connect with verified Gujarat suppliers.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Saved Suppliers", value: "4", icon: Bookmark, color: "text-amber-500" },
            { label: "Active Inquiries", value: "2", icon: MessageSquare, color: "text-green-500" },
            { label: "Audit Reports", value: "1", icon: FileText, color: "text-purple-500" },
            { label: "Verified Suppliers Browsed", value: "28", icon: TrendingUp, color: "text-blue-500" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <Icon size={18} className={`${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-ink">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-ink mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gold/30 hover:shadow-sm transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-ink group-hover:text-trust transition-colors">
                          {action.title}
                        </span>
                        <ArrowRight size={14} className="text-gray-400 group-hover:text-trust transition-colors" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Search shortcut */}
            <Link
              href="/suppliers"
              className="mt-4 flex items-center gap-3 bg-trust text-white rounded-2xl p-5 group hover:bg-trust/90 transition-colors"
            >
              <Search size={20} />
              <div className="flex-1">
                <div className="font-bold">Search Verified Suppliers</div>
                <div className="text-xs text-white/70">
                  Filter by city, industry, tier, minimum order
                </div>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="font-bold text-ink mb-4">Recent Activity</h2>
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
              {RECENT_ACTIVITY.map((activity, i) => (
                <Link
                  key={i}
                  href={activity.href}
                  className="block p-4 hover:bg-paper transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <p className="text-sm text-gray-700 leading-snug">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </Link>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">
                  Canada-Protected
                </span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                VerifyIndia is Canada-registered. All contracts can be
                legally executed through our Canadian entity for your
                protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
