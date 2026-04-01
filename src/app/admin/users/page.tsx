import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Users — Admin" };

const ROLE_STYLES: Record<string, string> = {
  buyer: "bg-blue-50 text-blue-700",
  supplier: "bg-amber-50 text-amber-700",
  admin: "bg-purple-50 text-purple-700",
};

export default async function UsersPage() {
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

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, email, role, created_at, avatar_url")
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users = (profiles ?? []) as any[];

  const counts = {
    total: users.length,
    buyers: users.filter((u) => u.role === "buyer").length,
    suppliers: users.filter((u) => u.role === "supplier").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            All registered accounts on VerifyIndia
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", count: counts.total, color: "text-gray-700" },
            { label: "Buyers", count: counts.buyers, color: "text-blue-600" },
            { label: "Suppliers", count: counts.suppliers, color: "text-amber-600" },
            { label: "Admins", count: counts.admins, color: "text-purple-600" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl border border-gray-100 p-4"
            >
              <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Role</th>
                  <th className="text-left px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-sm text-gray-400"
                    >
                      No users yet.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-paper/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-trust/10 flex items-center justify-center text-trust font-bold text-xs flex-shrink-0">
                          {(u.full_name || u.email || "?")[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-ink">
                          {u.full_name || <span className="text-gray-400 font-normal">No name</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                          ROLE_STYLES[u.role] ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {new Date(u.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
