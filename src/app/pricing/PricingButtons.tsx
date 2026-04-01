"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  plan: "bronze" | "silver" | "gold";
  label: string;
  className: string;
}

type AuthState = "loading" | "guest" | "supplier" | "buyer" | "admin";

export function PricingButton({ plan, label, className }: Props) {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setAuthState("guest");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      const role = profile?.role ?? "guest";
      setAuthState(role as AuthState);
    });
  }, []);

  async function handleCheckout() {
    setError(null);
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        setCheckoutLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setCheckoutLoading(false);
    }
  }

  // Subtle loading placeholder so page doesn't jump
  if (authState === "loading") {
    return (
      <div className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl opacity-60 ${className}`}>
        <Loader2 size={15} className="animate-spin" />
        Loading…
      </div>
    );
  }

  // Not logged in → take them to signup
  if (authState === "guest") {
    return (
      <Link
        href={`/auth/signup?role=supplier&plan=${plan}`}
        className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors ${className}`}
      >
        {label}
        <ArrowRight size={15} />
      </Link>
    );
  }

  // Logged in as buyer or admin → can't subscribe
  if (authState === "buyer" || authState === "admin") {
    return (
      <button
        disabled
        className="w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
        title="You are logged in as a buyer. Create a supplier account to subscribe."
      >
        {authState === "buyer" ? "Switch to supplier account" : "Admin account"}
      </button>
    );
  }

  // Logged in as supplier → go straight to Stripe
  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
      <button
        onClick={handleCheckout}
        disabled={checkoutLoading}
        className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors disabled:opacity-70 ${className}`}
      >
        {checkoutLoading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Opening Checkout…
          </>
        ) : (
          <>
            {label}
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </div>
  );
}
