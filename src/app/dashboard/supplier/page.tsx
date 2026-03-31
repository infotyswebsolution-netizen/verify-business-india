import { Metadata } from "next";
import Link from "next/link";
import {
  Edit,
  MessageSquare,
  BarChart2,
  CreditCard,
  ArrowRight,
  Eye,
  TrendingUp,
  Star,
} from "lucide-react";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

export const metadata: Metadata = {
  title: "Supplier Dashboard",
};

export default function SupplierDashboardPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">Supplier Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your profile, respond to buyer inquiries, track performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <VerificationBadge tier="gold" score={92} showScore size="sm" />
            <Link
              href="/suppliers/shree-textile-mills"
              className="text-sm text-trust font-medium hover:underline flex items-center gap-1"
            >
              <Eye size={14} />
              View Public Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Profile Views (30d)", value: "342", change: "+18%", icon: Eye, color: "text-blue-500" },
            { label: "New Inquiries", value: "7", change: "+3 this week", icon: MessageSquare, color: "text-green-500" },
            { label: "Avg. Rating", value: "4.8", change: "18 reviews", icon: Star, color: "text-amber-500" },
            { label: "Profile Score", value: "92/100", change: "Gold tier", icon: TrendingUp, color: "text-trust" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <Icon size={18} className={`${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-ink">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">{stat.change}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Navigation Cards */}
            {[
              {
                icon: Edit,
                title: "Edit Profile",
                description: "Update factory info, photos, certifications, product categories",
                href: "/dashboard/supplier/profile",
                color: "bg-blue-50 text-blue-600",
                cta: "Edit Now",
              },
              {
                icon: MessageSquare,
                title: "Buyer Inquiries",
                description: "7 pending inquiries — 2 from Canada, 3 from USA, 2 from UK",
                href: "/dashboard/supplier/inquiries",
                color: "bg-green-50 text-green-600",
                cta: "View Inquiries",
                badge: "7",
              },
              {
                icon: BarChart2,
                title: "Analytics",
                description: "Profile views by country, inquiry conversion, search rankings",
                href: "/dashboard/supplier/analytics",
                color: "bg-purple-50 text-purple-600",
                cta: "View Stats",
              },
              {
                icon: CreditCard,
                title: "Subscription & Billing",
                description: "Gold plan — renews December 2025 — Manage payment",
                href: "/dashboard/supplier/billing",
                color: "bg-amber-50 text-amber-600",
                cta: "Manage",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gold/30 hover:shadow-sm transition-all"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
                    <Icon size={19} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink group-hover:text-trust transition-colors">
                          {card.title}
                        </span>
                        {card.badge && (
                          <span className="bg-trust text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {card.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-trust font-medium group-hover:gap-2 flex items-center gap-1">
                        {card.cta}
                        <ArrowRight size={13} />
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{card.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-ink text-sm mb-3">
                Profile Completeness
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: "Basic info", done: true },
                  { label: "Factory photos (18/20)", done: true },
                  { label: "Product categories", done: true },
                  { label: "Certifications", done: true },
                  { label: "Production capacity", done: true },
                  { label: "Export history", done: false },
                  { label: "Video walkthrough", done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-emerald-500" : "bg-gray-200"}`}>
                      {item.done && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs ${item.done ? "text-gray-700" : "text-gray-400"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Completion</span>
                  <span className="font-bold text-trust">71%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-trust rounded-full" style={{ width: "71%" }} />
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="font-bold text-amber-800 text-sm mb-3">
                Pending Actions
              </h3>
              <ul className="space-y-2">
                {[
                  "Upload export history documents",
                  "Respond to 3 pending inquiries",
                  "Add video factory walkthrough",
                ].map((item) => (
                  <li key={item} className="text-xs text-amber-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
