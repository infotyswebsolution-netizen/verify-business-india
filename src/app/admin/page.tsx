import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building2,
  ClipboardCheck,
  CreditCard,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Dashboard — VerifyIndia" };

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:border-gray-200 transition-colors">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-ink">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {href && <ArrowRight size={16} className="ml-auto text-gray-300 flex-shrink-0 mt-1" />}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const now = new Date().toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalSuppliersRes,
    pendingRes,
    underReviewRes,
    activeSubsRes,
    weekInqRes,
    totalBuyersRes,
    recentSuppliersRes,
    recentInqRes,
  ] = await Promise.all([
    supabase.from("suppliers").select("*", { count: "exact", head: true }),
    supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "under_review"),
    supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true })
      .gt("active_until", now),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .gt("created_at", sevenDaysAgo),
    supabase.from("buyers").select("*", { count: "exact", head: true }),
    supabase
      .from("suppliers")
      .select("id, name, city, industry, verification_status, tier, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("inquiries")
      .select("id, subject, status, created_at, suppliers(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalSuppliers = totalSuppliersRes.count ?? 0;
  const pendingCount = (pendingRes.count ?? 0) + (underReviewRes.count ?? 0);
  const activeSubs = activeSubsRes.count ?? 0;
  const weekInquiries = weekInqRes.count ?? 0;
  const totalBuyers = totalBuyersRes.count ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentSuppliers = (recentSuppliersRes.data ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentInquiries = (recentInqRes.data ?? []) as any[];

  const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    under_review: "bg-blue-50 text-blue-700",
    verified: "bg-emerald-50 text-emerald-700",
    suspended: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">Admin Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Platform health at a glance — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Suppliers"
            value={totalSuppliers}
            icon={Building2}
            color="bg-trust/10 text-trust"
            href="/admin/suppliers"
          />
          <StatCard
            label="Pending Verification"
            value={pendingCount}
            sub="pending + under review"
            icon={ClipboardCheck}
            color="bg-amber-50 text-amber-600"
            href="/admin/verifications"
          />
          <StatCard
            label="Active Subscriptions"
            value={activeSubs}
            sub="sub_active_until > now"
            icon={CreditCard}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Inquiries This Week"
            value={weekInquiries}
            sub="last 7 days"
            icon={MessageSquare}
            color="bg-blue-50 text-blue-600"
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard
            label="Registered Buyers"
            value={totalBuyers}
            icon={Users}
            color="bg-violet-50 text-violet-600"
          />
          <StatCard
            label="Verified Suppliers"
            value={`${totalSuppliers > 0 ? Math.round((activeSubs / totalSuppliers) * 100) : 0}%`}
            sub="have active subscriptions"
            icon={TrendingUp}
            color="bg-gold/10 text-gold"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent supplier signups */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-ink text-sm">Recent Supplier Signups</h2>
              <Link
                href="/admin/suppliers"
                className="text-xs text-trust hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentSuppliers.length === 0 && (
                <p className="px-5 py-4 text-sm text-gray-400">No suppliers yet.</p>
              )}
              {recentSuppliers.map((s) => (
                <div key={s.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{s.name}</p>
                    <p className="text-xs text-gray-400">
                      {s.city} · {s.industry}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[s.verification_status] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    {s.verification_status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent inquiries */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-ink text-sm">Recent Inquiries</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {recentInquiries.length === 0 && (
                <p className="px-5 py-4 text-sm text-gray-400">No inquiries yet.</p>
              )}
              {recentInquiries.map((inq) => {
                const sup = Array.isArray(inq.suppliers) ? inq.suppliers[0] : inq.suppliers;
                const STATUS_INQ: Record<string, string> = {
                  pending: "bg-amber-50 text-amber-700",
                  accepted: "bg-emerald-50 text-emerald-700",
                  declined: "bg-red-50 text-red-600",
                };
                return (
                  <div key={inq.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{inq.subject}</p>
                      <p className="text-xs text-gray-400">→ {sup?.name ?? "Unknown supplier"}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_INQ[inq.status] ?? "bg-gray-100 text-gray-500"}`}
                    >
                      {inq.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-ink text-sm mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/verifications"
              className="flex items-center gap-2 bg-trust text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-trust/90 transition-colors"
            >
              <Clock size={15} />
              Review Verifications
              {pendingCount > 0 && (
                <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin/suppliers"
              className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-gray-300 hover:bg-paper transition-colors"
            >
              <Building2 size={15} />
              All Suppliers
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-gray-300 hover:bg-paper transition-colors"
            >
              <Users size={15} />
              Users
            </Link>
          </div>
        </div>

        {/* Audit checklist quick note */}
        {pendingCount > 0 && (
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {pendingCount} supplier{pendingCount !== 1 ? "s" : ""} waiting for verification
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Schedule audits and complete the 25-point checklist to award badges.{" "}
                <Link href="/admin/verifications" className="underline font-medium">
                  Go to queue →
                </Link>
              </p>
            </div>
          </div>
        )}

        {pendingCount === 0 && (
          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700 font-medium">
              Verification queue is clear — all suppliers have been reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
