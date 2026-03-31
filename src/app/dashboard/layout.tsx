import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell, DashboardUser } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
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

  // Fetch profile + buyer/supplier data for sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email, avatar_url")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  let company: string | null = null;

  if (profile.role === "buyer") {
    const { data: buyer } = await supabase
      .from("buyers")
      .select("company")
      .eq("user_id", user.id)
      .single();
    company = buyer?.company ?? null;
  } else if (profile.role === "supplier") {
    const { data: supplier } = await supabase
      .from("suppliers")
      .select("name")
      .eq("user_id", user.id)
      .single();
    company = supplier?.name ?? null;
  }

  const dashboardUser: DashboardUser = {
    name: profile.full_name ?? user.email ?? "User",
    company,
    email: profile.email || user.email || "",
    role: profile.role as DashboardUser["role"],
    avatarUrl: profile.avatar_url,
  };

  return <DashboardShell user={dashboardUser}>{children}</DashboardShell>;
}
