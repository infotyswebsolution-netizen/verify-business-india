import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Search,
  Bookmark,
  MessageSquare,
  FileText,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

export const metadata: Metadata = { title: "Buyer Overview" };
export const dynamic = "force-dynamic";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
} as const;

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function BuyerOverviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get buyer record
  const { data: buyer } = await supabase
    .from("buyers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  // If no buyer record yet (e.g. Google OAuth, profile incomplete)
  if (!buyer) {
    return (
      <div className="p-8 max-w-lg">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <AlertCircle size={24} className="text-amber-600 mb-3" />
          <h2 className="font-bold text-ink mb-1">Complete your buyer profile</h2>
          <p className="text-sm text-gray-600 mb-4">
            We need a few more details to activate your buyer account.
          </p>
          <Link
            href="/dashboard/buyer/settings"
            className="inline-flex items-center gap-2 bg-trust text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-trust/90 transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    );
  }

  // Fetch stats in parallel
  const [activeInqResult, savedResult, recentInqResult] = await Promise.all([
    // Active inquiry count
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("buyer_id", buyer.id)
      .in("status", ["pending", "accepted"]),

    // Saved supplier count
    supabase
      .from("saved_suppliers")
      .select("id", { count: "exact", head: true })
      .eq("buyer_id", buyer.id),

    // Last 5 inquiries with supplier info
    supabase
      .from("inquiries")
      .select(
        "id, created_at, status, message, supplier_id, suppliers(name, slug, tier)"
      )
      .eq("buyer_id", buyer.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const activeCount = activeInqResult.count ?? 0;
  const savedCount = savedResult.count ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentInquiries = (recentInqResult.data ?? []) as any[];

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
      description: `${savedCount} supplier${savedCount !== 1 ? "s" : ""} shortlisted`,
      href: "/dashboard/buyer/saved",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: MessageSquare,
      title: "My Inquiries",
      description: `${activeCount} active inquiry${activeCount !== 1 ? "s" : ""}`,
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

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">Buyer Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Find, shortlist, and connect with verified Gujarat suppliers.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Active Inquiries",
              value: activeCount,
              icon: MessageSquare,
              color: "text-green-500",
              href: "/dashboard/buyer/inquiries",
            },
            {
              label: "Saved Suppliers",
              value: savedCount,
              icon: Bookmark,
              color: "text-amber-500",
              href: "/dashboard/buyer/saved",
            },
            {
              label: "Audit Reports",
              value: 0,
              icon: FileText,
              color: "text-purple-500",
              href: "/dashboard/buyer/reports",
            },
            {
              label: "Verified Suppliers",
              value: "500+",
              icon: ShieldCheck,
              color: "text-trust",
              href: "/suppliers",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gold/30 hover:shadow-sm transition-all group"
              >
                <Icon size={18} className={`${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-ink">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Quick Actions — left 3 cols */}
          <div className="lg:col-span-3 space-y-5">
            <h2 className="font-bold text-ink">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gold/30 hover:shadow-sm transition-all"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-ink group-hover:text-trust transition-colors">
                          {action.title}
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-gray-400 group-hover:text-trust transition-colors"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/suppliers"
              className="flex items-center gap-3 bg-trust text-white rounded-2xl p-5 group hover:bg-trust/90 transition-colors"
            >
              <Search size={20} />
              <div className="flex-1">
                <div className="font-bold">Search Verified Suppliers</div>
                <div className="text-xs text-white/70">
                  Filter by city, industry, tier, minimum order
                </div>
              </div>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Recent Inquiries — right 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">Recent Inquiries</h2>
              <Link
                href="/dashboard/buyer/inquiries"
                className="text-xs text-trust hover:underline"
              >
                View all
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <MessageSquare size={28} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500 mb-1">
                  No inquiries yet
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Find a supplier and send your first inquiry.
                </p>
                <Link
                  href="/suppliers"
                  className="inline-flex items-center gap-1.5 bg-trust text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-trust/90 transition-colors"
                >
                  <Plus size={13} />
                  Browse Suppliers
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                {recentInquiries.map((inq) => {
                  const subjectLine = inq.message.split("\n")[0] ?? "";
                  const subject = subjectLine.startsWith("Subject: ")
                    ? subjectLine.replace("Subject: ", "")
                    : "Inquiry";
                    const supplier = Array.isArray(inq.suppliers) ? inq.suppliers[0] : inq.suppliers;

                  return (
                    <Link
                      key={inq.id}
                      href={`/dashboard/buyer/inquiries?id=${inq.id}`}
                      className="block p-4 hover:bg-paper transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-ink truncate flex-1">
                          {supplier?.name ?? "Supplier"}
                        </p>
                        <StatusBadge status={inq.status} />
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {subject}
                      </p>
                      <div className="flex items-center gap-2">
                        {supplier?.tier && (
                          <VerificationBadge
                            tier={supplier.tier as "bronze" | "silver" | "gold"}
                            size="sm"
                          />
                        )}
                        <span className="text-xs text-gray-400">
                          {formatRelativeDate(inq.created_at)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Trust note */}
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">
                  Buyer Protection
                </span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                All suppliers on VerifyIndia are physically audited.
                Contracts can be executed through our Canadian entity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
