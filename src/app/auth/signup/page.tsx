"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Building2, Users, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function SignupForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") as "buyer" | "supplier" | null;

  const [role, setRole] = useState<"buyer" | "supplier">(
    defaultRole === "supplier" ? "supplier" : "buyer"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, company },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">Check Your Email</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account and{" "}
          {role === "supplier"
            ? "start your supplier listing."
            : "start finding verified suppliers."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Role Toggle */}
      <div className="flex rounded-xl bg-paper border border-gray-200 p-1 mb-6">
        {(
          [
            { value: "buyer", label: "I'm a Buyer", icon: Users },
            { value: "supplier", label: "I'm a Supplier", icon: Building2 },
          ] as const
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              role === value
                ? "bg-white shadow-sm text-trust"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {role === "supplier" ? "Factory / Business Name *" : "Company *"}
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            placeholder={role === "supplier" ? "Your factory name" : "Your company name"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              placeholder="Minimum 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="text-trust hover:underline">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-trust hover:underline">Privacy Policy</Link>.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-trust text-white font-bold py-3 rounded-xl hover:bg-trust/90 transition-colors disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : role === "supplier" ? (
            "Create Supplier Account"
          ) : (
            "Create Buyer Account"
          )}
        </button>
      </form>
    </>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-trust flex items-center justify-center">
              <ShieldCheck size={20} className="text-gold" />
            </div>
            <span className="font-bold text-2xl text-ink">
              Verify<span className="text-gold">India</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-ink mt-4 mb-1">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm">Free to start. Upgrade anytime.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <Suspense fallback={<div className="h-40 animate-pulse bg-paper rounded-xl" />}>
            <SignupForm />
          </Suspense>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-trust font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
