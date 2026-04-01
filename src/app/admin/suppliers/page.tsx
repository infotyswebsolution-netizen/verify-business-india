import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "All Suppliers — Admin" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  under_review: "bg-blue-50 text-blue-700",
  verified: "bg-emerald-50 text-emerald-700",
  suspended: "bg-red-50 text-red-600",
};

const TIER_COLORS: Record<string, string> = {
  gold: "bg-amber-50 text-amber-700",
  silver: "bg-slate-100 text-slate-600",
  bronze: "bg-orange-50 text-orange-700",
};

export default async function AllSuppliersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  const { data: rows } = await supabase
    .from("suppliers")
    .select(
      "id, name, slug, city, industry, tier, verification_status, verification_score, active_until, created_at, user_id"
    )
    .order("created_at", { ascending: false });

  const userIds = (rows ?? []).map((r) => r.user_id);
  const { data: profileRows } = userIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds)
    : { data: [] };

  const profileMap = Object.fromEntries(
    (profileRows ?? []).map((p) => [p.user_id, p])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const suppliers = (rows ?? []) as any[];

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">All Suppliers</h1>
          <p className="text-gray-500 text-sm mt-1">
            {suppliers.length} total supplier{suppliers.length !== 1 ? "s" : ""} registered
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Supplier</th>
                  <th className="text-left px-5 py-3">Contact</th>
                  <th className="text-left px-5 py-3">Tier</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Score</th>
                  <th className="text-left px-5 py-3">Active Until</th>
                  <th className="text-left px-5 py-3">Joined</th>
                  <th className="text-left px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {suppliers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400">
                      No suppliers yet.
                    </td>
                  </tr>
                )}
                {suppliers.map((s) => {
                  const p = profileMap[s.user_id];
                  const activeUntil = s.active_until
                    ? new Date(s.active_until).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : null;
                  const isExpired =
                    s.active_until && new Date(s.active_until) < new Date();

                  return (
                    <tr key={s.id} className="hover:bg-paper/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-ink">{s.name}</div>
                        <div className="text-xs text-gray-500">
                          {s.city}{s.industry ? ` · ${s.industry}` : ""}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs text-gray-700">{p?.full_name ?? "—"}</div>
                        <div className="text-xs text-gray-400">{p?.email ?? "—"}</div>
                      </td>
                      <td className="px-5 py-4">
                        {s.tier ? (
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                              TIER_COLORS[s.tier] ?? "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {s.tier}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            STATUS_STYLES[s.verification_status] ??
                            "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {s.verification_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {s.verification_score != null ? (
                          <span
                            className={`text-sm font-bold ${
                              s.verification_score >= 75
                                ? "text-emerald-600"
                                : s.verification_score >= 60
                                ? "text-amber-600"
                                : "text-red-500"
                            }`}
                          >
                            {s.verification_score}/100
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {activeUntil ? (
                          <span className={isExpired ? "text-red-500" : "text-gray-600"}>
                            {activeUntil}
                            {isExpired && " (expired)"}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {new Date(s.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        {s.slug && (
                          <Link
                            href={`/suppliers/${s.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-trust hover:bg-paper transition-colors inline-flex"
                            title="View public profile"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
