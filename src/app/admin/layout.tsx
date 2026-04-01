import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell, DashboardUser } from "@/components/dashboard/DashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email, avatar_url")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  const adminUser: DashboardUser = {
    name: profile.full_name ?? user.email ?? "Admin",
    company: "Admin Panel",
    email: profile.email || user.email || "",
    role: "admin",
    avatarUrl: profile.avatar_url,
  };

  return <DashboardShell user={adminUser}>{children}</DashboardShell>;
}
