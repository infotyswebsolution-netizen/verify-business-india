import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Edit,
  Eye,
  ArrowRight,
  Building2,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { VerificationBadge, ScoreRing } from "@/components/ui/VerificationBadge";

export const metadata: Metadata = { title: "Supplier Overview" };
export const dynamic = "force-dynamic";

// Calculate profile completion percentage
function calcCompletion(supplier: {
  name: string | null;
  description: string | null;
  product_categories: string[];
  production_volume: string | null;
  min_order_value: number | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
}, mediaCount: number, certCount: number) {
  const checks = [
    { label: "Business name", weight: 10, done: !!supplier.name },
    { label: "Description", weight: 15, done: !!(supplier.description && supplier.description.length > 50) },
    { label: "Factory photos", weight: 20, done: mediaCount > 0 },
    { label: "Certifications", weight: 15, done: certCount > 0 },
    { label: "Product categories", weight: 15, done: supplier.product_categories.length > 0 },
    {
      label: "Production capacity",
      weight: 15,
      done: !!(supplier.production_volume || (supplier.min_order_value !== null && supplier.min_order_value > 0)),
    },
    {
      label: "Contact details",
      weight: 10,
      done: [supplier.phone, supplier.whatsapp, supplier.email, supplier.website].filter(Boolean).length >= 2,
    },
  ];
  const total = checks.reduce((sum, c) => sum + (c.done ? c.weight : 0), 0);
  return { checks, total };
}

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
  accepted: { label: "Accepted", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined: { label: "Declined", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
} as const;

function StatusBadge({ status }: { status: "pending" | "accepted" | "declined" }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function formatRelativeDate(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function SupplierOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id, name, slug, status, tier, verification_score, description, product_categories, production_volume, min_order_value, phone, whatsapp, email, website")
    .eq("user_id", user.id)
    .single();

  if (!supplier) {
    return (
      <div className="p-8 max-w-lg">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <AlertTriangle size={24} className="text-amber-600 mb-3" />
          <h2 className="font-bold text-ink mb-1">No supplier profile found</h2>
          <p className="text-sm text-gray-600">Your account was set up as a supplier, but no profile record exists.</p>
        </div>
      </div>
    );
  }

  const [mediaRes, certRes, inquiriesRes, monthInqRes] = await Promise.all([
    supabase.from("supplier_media").select("id", { count: "exact", head: true }).eq("supplier_id", supplier.id).eq("type", "photo"),
    supabase.from("certifications").select("id", { count: "exact", head: true }).eq("supplier_id", supplier.id),
    supabase.from("inquiries")
      .select("id, created_at, status, message, buyers(company, country)")
      .eq("supplier_id", supplier.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("supplier_id", supplier.id)
      .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  const mediaCount = mediaRes.count ?? 0;
  const certCount = certRes.count ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentInquiries = (inquiriesRes.data ?? []) as any[];
  const monthCount = monthInqRes.count ?? 0;
  const pendingCount = recentInquiries.filter((i) => i.status === "pending").length;
  const { checks, total: completionPct } = calcCompletion(supplier, mediaCount, certCount);

  const isVerified = supplier.status === "verified";
  const isPending = ["pending_review", "audit_scheduled", "audit_complete"].includes(supplier.status);
  const isSuspended = supplier.status === "suspended";

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Verification Status Banner ── */}
        {isSuspended && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-5">
            <ShieldX size={22} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800">Your account has been suspended</p>
              <p className="text-sm text-red-700 mt-0.5">
                Contact <a href="mailto:support@verifyindia.com" className="underline">support@verifyindia.com</a> to resolve this.
              </p>
            </div>
          </div>
        )}

        {isPending && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <Clock size={22} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800">Profile under review</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Our team will contact you within 5 business days to schedule an audit.
                {supplier.status === "audit_scheduled" && " Your audit is scheduled — we'll be in touch with the date."}
              </p>
            </div>
          </div>
        )}

        {isVerified && (
          <div className="flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <ShieldCheck size={22} className="text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-emerald-800">Verified Supplier</p>
                <p className="text-sm text-emerald-700">Your profile is live and searchable by buyers worldwide.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {supplier.tier && (
                <VerificationBadge tier={supplier.tier as "bronze" | "silver" | "gold"} size="sm" />
              )}
              {supplier.verification_score !== null && (
                <ScoreRing score={supplier.verification_score} size={64} tier={supplier.tier as "bronze" | "silver" | "gold" | null} />
              )}
            </div>
          </div>
        )}

        {/* ── Header row ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">{supplier.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">Supplier Dashboard</p>
          </div>
          {isVerified && supplier.slug && (
            <Link
              href={`/suppliers/${supplier.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-trust font-medium hover:underline"
            >
              <Eye size={14} />
              Public Profile
            </Link>
          )}
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Inquiries this month", value: monthCount, icon: MessageSquare, color: "text-green-500", href: "/dashboard/supplier/inquiries" },
            { label: "Pending responses", value: pendingCount, icon: Clock, color: "text-amber-500", href: "/dashboard/supplier/inquiries" },
            { label: "Profile completion", value: `${completionPct}%`, icon: Building2, color: "text-trust", href: "/dashboard/supplier/profile" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} href={s.href} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gold/30 hover:shadow-sm transition-all">
                <Icon size={18} className={`${s.color} mb-2`} />
                <div className="text-2xl font-bold text-ink">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── Recent Inquiries ── */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">Recent Inquiries</h2>
              <Link href="/dashboard/supplier/inquiries" className="text-xs text-trust hover:underline">View all</Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <MessageSquare size={28} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No inquiries yet.</p>
                <p className="text-xs text-gray-400 mt-1">Buyers will contact you once your profile is live.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                {recentInquiries.map((inq) => {
                  const buyer = Array.isArray(inq.buyers) ? inq.buyers[0] : inq.buyers;
                  const subjectLine = (inq.message as string).split("\n")[0] ?? "";
                  const subject = subjectLine.startsWith("Subject: ") ? subjectLine.replace("Subject: ", "") : "Inquiry";
                  return (
                    <Link
                      key={inq.id}
                      href={`/dashboard/supplier/inquiries?id=${inq.id}`}
                      className="block px-5 py-4 hover:bg-paper transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-ink truncate">
                              {buyer?.company ?? "Buyer"}
                            </p>
                            {buyer?.country && (
                              <span className="text-xs text-gray-400 flex-shrink-0">{buyer.country}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{subject}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={inq.status} />
                          <span className="text-xs text-gray-400">{formatRelativeDate(inq.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Quick actions */}
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                { href: "/dashboard/supplier/profile", icon: Edit, label: "Edit Profile", desc: "Update photos, capacity, certifications" },
                { href: "/dashboard/supplier/billing", icon: Calendar, label: "Manage Billing", desc: "Subscription and payment details" },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.href} href={a.href} className="group flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-gold/30 hover:shadow-sm transition-all">
                    <div className="w-9 h-9 rounded-xl bg-trust/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-trust" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink group-hover:text-trust transition-colors flex items-center gap-1">
                        {a.label} <ArrowRight size={13} />
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Profile Completeness ── */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-ink mb-4">Profile Completeness</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-ink">{completionPct}%</span>
                  <span className="text-sm text-gray-500 ml-1">complete</span>
                </div>
                <Link href="/dashboard/supplier/profile" className="text-xs text-trust hover:underline font-medium">
                  Complete profile →
                </Link>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${completionPct}%`,
                    background: completionPct >= 80 ? "#10B981" : completionPct >= 50 ? "#F59E0B" : "#1a2332",
                  }}
                />
              </div>
              <ul className="space-y-2.5">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${c.done ? "bg-emerald-100" : "bg-gray-100"}`}>
                      {c.done
                        ? <CheckCircle2 size={13} className="text-emerald-600" />
                        : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                    </div>
                    <span className={`text-xs flex-1 ${c.done ? "text-gray-700" : "text-gray-400"}`}>{c.label}</span>
                    <span className={`text-xs font-medium ${c.done ? "text-emerald-600" : "text-gray-400"}`}>+{c.weight}%</span>
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
