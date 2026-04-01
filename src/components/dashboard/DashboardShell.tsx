"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Bookmark,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  ChevronRight,
  Package,
  BarChart3,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface DashboardUser {
  name: string;
  company: string | null;
  email: string;
  role: "buyer" | "supplier" | "admin";
  avatarUrl: string | null;
}

const BUYER_LINKS = [
  { href: "/dashboard/buyer", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/buyer/inquiries", label: "My Inquiries", icon: MessageSquare },
  { href: "/dashboard/buyer/saved", label: "Saved Suppliers", icon: Bookmark },
  { href: "/dashboard/buyer/reports", label: "Audit Reports", icon: FileText },
  { href: "/dashboard/buyer/settings", label: "Account Settings", icon: Settings },
];

const SUPPLIER_LINKS = [
  { href: "/dashboard/supplier", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/supplier/profile", label: "My Profile", icon: Building2 },
  { href: "/dashboard/supplier/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/dashboard/supplier/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/supplier/billing", label: "Billing", icon: Package },
  { href: "/dashboard/supplier/settings", label: "Settings", icon: Settings },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/verifications", label: "Verifications", icon: ClipboardCheck },
  { href: "/admin/suppliers", label: "Suppliers", icon: Building2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function getLinks(role: DashboardUser["role"]) {
  if (role === "supplier") return SUPPLIER_LINKS;
  if (role === "admin") return ADMIN_LINKS;
  return BUYER_LINKS;
}

function AvatarInitials({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={cn(
        "rounded-full bg-trust flex items-center justify-center font-bold text-white flex-shrink-0",
        size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
      )}
    >
      {initials}
    </div>
  );
}

interface SidebarContentProps {
  user: DashboardUser;
  onLinkClick?: () => void;
  onSignOut: () => void;
}

function SidebarContent({ user, onLinkClick, onSignOut }: SidebarContentProps) {
  const pathname = usePathname();
  const links = getLinks(user.role);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={onLinkClick}
        >
          <div className="w-8 h-8 rounded-lg bg-trust flex items-center justify-center">
            <ShieldCheck size={16} className="text-gold" />
          </div>
          <span className="font-bold text-lg text-ink">
            Verify<span className="text-gold">India</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <AvatarInitials name={user.name || user.email} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">
              {user.name || "Account"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.company || user.email}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
              user.role === "buyer"
                ? "bg-blue-50 text-blue-700"
                : user.role === "supplier"
                ? "bg-amber-50 text-amber-700"
                : "bg-purple-50 text-purple-700"
            )}
          >
            {user.role === "buyer"
              ? "Buyer Account"
              : user.role === "supplier"
              ? "Supplier Account"
              : "Admin"}
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname?.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-trust text-white"
                      : "text-gray-600 hover:bg-paper hover:text-ink"
                  )}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {link.label}
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto opacity-60" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

interface DashboardShellProps {
  user: DashboardUser;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  const pathname = usePathname();
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex h-screen bg-paper overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-gray-100 flex-shrink-0">
        <SidebarContent
          user={user}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          user={user}
          onLinkClick={() => setMobileOpen(false)}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-paper transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-trust" />
            <span className="font-bold text-sm text-ink">
              Verify<span className="text-gold">India</span>
            </span>
          </Link>
        </div>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
