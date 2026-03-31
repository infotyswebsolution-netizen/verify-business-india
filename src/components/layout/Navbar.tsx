"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/suppliers", label: "Find Suppliers" },
  {
    label: "Industries",
    children: [
      { href: "/industries/textiles", label: "Textiles & Fabrics" },
      { href: "/industries/diamonds", label: "Diamonds & Gems" },
      { href: "/industries/metals", label: "Metals & Welding" },
      { href: "/industries/chemicals", label: "Chemicals" },
      { href: "/industries/pharmaceuticals", label: "Pharmaceuticals" },
      { href: "/industries/engineering", label: "Engineering" },
    ],
  },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const pathname = usePathname();

  // Dashboard and admin have their own layout — no global nav
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-paper-dark shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-trust flex items-center justify-center">
              <ShieldCheck size={18} className="text-gold" />
            </div>
            <span className="font-bold text-xl text-ink">
              Verify<span className="text-gold">India</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gold transition-colors"
                    onMouseEnter={() => setIndustriesOpen(true)}
                    onMouseLeave={() => setIndustriesOpen(false)}
                  >
                    {link.label}
                    <ChevronDown size={14} />
                  </button>
                  <div
                    className={cn(
                      "absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transition-all",
                      industriesOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    )}
                    onMouseEnter={() => setIndustriesOpen(true)}
                    onMouseLeave={() => setIndustriesOpen(false)}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-paper hover:text-gold transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="text-sm font-medium text-gray-700 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-gold transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-semibold bg-trust text-white px-4 py-2 rounded-lg hover:bg-trust/90 transition-colors"
            >
              Get Listed
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-paper-dark transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-paper-dark py-4 space-y-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {link.label}
                  </div>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-6 py-2 text-sm text-gray-700 hover:text-gold"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gold rounded-lg hover:bg-paper-dark"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-paper-dark mt-3 flex flex-col gap-2 px-3">
              <Link
                href="/auth/login"
                className="text-center py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-center py-2 text-sm font-semibold bg-trust text-white rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Get Listed Free
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
