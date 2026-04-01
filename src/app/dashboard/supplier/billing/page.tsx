"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Crown,
} from "lucide-react";

// Fetched client-side to avoid SSR issues with searchParams
interface BillingData {
  plan: string | null;
  active_until: string | null;
  stripe_customer_id: string | null;
  tier: string | null;
}

const PLAN_CONFIG = {
  bronze: { label: "Bronze", color: "bg-orange-50 border-orange-200 text-orange-800", features: ["Listed in directory", "Basic profile", "Buyer inquiries"] },
  silver: { label: "Silver", color: "bg-slate-50 border-slate-200 text-slate-800", features: ["Everything in Bronze", "25-point audit report", "Verified badge", "Priority listing"] },
  gold: { label: "Gold", color: "bg-amber-50 border-amber-200 text-amber-800", features: ["Everything in Silver", "Gold badge", "Featured placement", "Analytics dashboard"] },
} as const;

function SuccessBanner() {
  const searchParams = useSearchParams();
  if (!searchParams.get("success")) return null;
  return (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
      <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
      <div>
        <p className="font-semibold text-emerald-800">Payment successful!</p>
        <p className="text-sm text-emerald-700">Your subscription has been updated. Changes may take a moment to reflect.</p>
      </div>
    </div>
  );
}

function BillingContent() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/billing/info")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ plan: null, active_until: null, stripe_customer_id: null, tier: null }))
      .finally(() => setLoading(false));
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  const plan = data?.plan as keyof typeof PLAN_CONFIG | null;
  const isActive = !!(data?.active_until && new Date(data.active_until) > new Date());
  const planCfg = plan && PLAN_CONFIG[plan] ? PLAN_CONFIG[plan] : null;

  const renewalDate = data?.active_until
    ? new Date(data.active_until).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <>
      <Suspense fallback={null}>
        <SuccessBanner />
      </Suspense>

      {/* Current subscription */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <h2 className="font-bold text-ink mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-trust" />
          Current Subscription
        </h2>

        {planCfg && isActive ? (
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${planCfg.color}`}>
              <Crown size={16} />
              {planCfg.label} Plan — Active
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} className="text-gray-400" />
              Renews on {renewalDate}
            </div>

            <ul className="space-y-2 pt-2 border-t border-gray-50">
              {planCfg.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {data?.stripe_customer_id && (
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="mt-2 inline-flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-paper transition-colors disabled:opacity-60"
              >
                {portalLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <ExternalLink size={15} />
                )}
                Manage Billing on Stripe
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck size={16} className="text-gray-400" />
              <span>
                {isActive ? `${plan?.charAt(0).toUpperCase()}${plan?.slice(1)} plan` : "No active subscription"}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              You&apos;re currently on the free tier. Upgrade to get verified, appear in buyer searches, and receive direct inquiries.
            </p>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-trust text-white font-bold px-6 py-3 rounded-xl hover:bg-trust/90 transition-colors"
            >
              View Plans & Pricing
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Plans comparison */}
      {(!planCfg || !isActive) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-ink mb-4">Available Plans</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {(Object.entries(PLAN_CONFIG) as [string, typeof PLAN_CONFIG[keyof typeof PLAN_CONFIG]][]).map(([key, cfg]) => (
              <div key={key} className={`rounded-xl border p-4 ${cfg.color}`}>
                <p className="font-bold mb-3 capitalize">{cfg.label}</p>
                <ul className="space-y-1.5">
                  {cfg.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs">
                      <CheckCircle2 size={12} className="flex-shrink-0 mt-0.5 opacity-70" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-2 text-trust text-sm font-semibold hover:underline"
          >
            See full comparison & pricing <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </>
  );
}

export default function SupplierBillingPage() {
  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-ink mb-1">Billing</h1>
        <p className="text-gray-500 text-sm mb-6">Manage your subscription and payment details.</p>
        <Suspense fallback={<div className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />}>
          <BillingContent />
        </Suspense>
      </div>
    </div>
  );
}
