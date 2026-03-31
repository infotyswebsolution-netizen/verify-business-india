import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Account Settings" };
export const dynamic = "force-dynamic";

export default async function BuyerSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("user_id", user.id)
    .single();

  const { data: buyer } = await supabase
    .from("buyers")
    .select("company, country, phone")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-ink mb-1">Account Settings</h1>
        <p className="text-gray-500 text-sm mb-8">Manage your buyer profile and preferences.</p>

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile</p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Full Name</span>
                <span className="font-medium text-ink">{profile?.full_name ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Email</span>
                <span className="font-medium text-ink">{profile?.email ?? user.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Company</span>
                <span className="font-medium text-ink">{buyer?.company ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Country</span>
                <span className="font-medium text-ink">{buyer?.country ?? "—"}</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 italic">
              Profile editing coming soon. Contact support to update your details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
