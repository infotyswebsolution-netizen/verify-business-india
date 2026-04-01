import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VerificationQueue, SupplierRow } from "./VerificationQueue";

export const metadata: Metadata = { title: "Verification Queue — Admin" };

export default async function VerificationQueuePage() {
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
      "id, name, city, industry, tier, verification_status, created_at, user_id"
    )
    .order("created_at", { ascending: false });

  // Fetch emails in parallel
  const userIds = (rows ?? []).map((r) => r.user_id);
  const { data: profileRows } = userIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, email")
        .in("user_id", userIds)
    : { data: [] };

  const emailMap = Object.fromEntries(
    (profileRows ?? []).map((p) => [p.user_id, p.email])
  );

  const suppliers: SupplierRow[] = (rows ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city ?? null,
    industry: r.industry ?? null,
    tier: r.tier ?? null,
    verification_status: r.verification_status ?? "pending",
    created_at: r.created_at,
    email: emailMap[r.user_id] ?? null,
  }));

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Verification Queue</h1>
          <p className="text-gray-500 text-sm mt-1">
            Schedule audits, complete 25-point checklists, and award verified badges.
          </p>
        </div>

        <VerificationQueue suppliers={suppliers} />
      </div>
    </div>
  );
}
