"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

const FOOTER_LINKS = {
  platform: [
    { href: "/suppliers", label: "Find Suppliers" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/resources", label: "Resources & Blog" },
  ],
  industries: [
    { href: "/industries/textiles", label: "Textiles & Fabrics" },
    { href: "/industries/diamonds", label: "Diamonds & Gems" },
    { href: "/industries/metals", label: "Metals & Welding" },
    { href: "/industries/chemicals", label: "Chemicals" },
    { href: "/industries/pharmaceuticals", label: "Pharmaceuticals" },
    { href: "/industries/engineering", label: "Engineering" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-trust flex items-center justify-center">
                <ShieldCheck size={20} className="text-gold" />
              </div>
              <span className="font-bold text-xl">
                Verify<span className="text-gold">India</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              The trusted platform connecting Western buyers with verified
              Gujarat suppliers. Every listing is physically audited.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold flex-shrink-0" />
                <span>Ontario, Canada · Ahmedabad, Gujarat</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold flex-shrink-0" />
                <a
                  href="mailto:hello@verifyindia.com"
                  className="hover:text-gold transition-colors"
                >
                  hello@verifyindia.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <span>WhatsApp available</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Industries
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.industries.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} VerifyIndia. Canada-registered. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-gold" />
              SSL Secured
            </span>
            <span>·</span>
            <span>PIPEDA Compliant</span>
            <span>·</span>
            <span>Stripe Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
