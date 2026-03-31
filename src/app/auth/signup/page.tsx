"use client";

export const dynamic = "force-dynamic";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShieldCheck,
  Building2,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GUJARAT_CITIES, INDUSTRIES } from "@/lib/utils";

// ---------- Schemas ----------

const buyerSchema = z.object({
  role: z.literal("buyer"),
  fullName: z.string().min(2, "Full name is required"),
  company: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Select your country"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

const supplierSchema = z.object({
  role: z.literal("supplier"),
  fullName: z.string().min(2, "Contact name is required"),
  companyName: z.string().min(2, "Company name is required"),
  city: z.string().min(1, "Select your city"),
  industry: z.string().min(1, "Select your industry"),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid 15-digit GSTIN"
    )
    .or(z.literal("")),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

type BuyerFormData = z.infer<typeof buyerSchema>;
type SupplierFormData = z.infer<typeof supplierSchema>;

// --------------- Country list (abbreviated) ---------------
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "AE", name: "UAE" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "IN", name: "India" },
  { code: "OTHER", name: "Other" },
];

const PLAN_LABELS: Record<string, string> = {
  bronze: "Bronze — ₹4,999/mo",
  silver: "Silver — ₹9,999/mo",
  gold: "Gold — ₹19,999/mo",
};

// --------------- Buyer Form ---------------
function BuyerSignupForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: { role: "buyer" },
  });

  async function onSubmit(values: BuyerFormData) {
    setServerError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, role: "buyer" },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/buyer`,
      },
    });

    if (error) {
      setServerError(
        error.message.includes("already registered")
          ? "This email is already registered. Try signing in."
          : error.message
      );
      return;
    }

    if (data.user) {
      await fetch("/api/auth/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
          role: "buyer",
          fullName: values.fullName,
          company: values.company,
          country: values.country,
        }),
      });
    }

    onSuccess(values.email);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="hidden" {...register("role")} />

      {serverError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name *
          </label>
          <input
            {...register("fullName")}
            type="text"
            autoComplete="name"
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
              errors.fullName ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Company / Organization *
          </label>
          <input
            {...register("company")}
            type="text"
            autoComplete="organization"
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
              errors.company ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            placeholder="Your company name"
          />
          {errors.company && (
            <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Country *
          </label>
          <div className="relative">
            <select
              {...register("country")}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors appearance-none bg-white ${
                errors.country ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          {errors.country && (
            <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address *
        </label>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
            errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password *
        </label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className={`w-full px-4 py-2.5 pr-11 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
              errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <p className="text-xs text-gray-400">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="text-trust hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-trust hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-trust text-white font-bold py-3 rounded-xl hover:bg-trust/90 transition-colors disabled:opacity-60 flex items-center justify-center"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          "Create Buyer Account"
        )}
      </button>
    </form>
  );
}

// --------------- Supplier Form ---------------
function SupplierSignupForm({
  plan,
  onSuccess,
}: {
  plan: string;
  onSuccess: (email: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { role: "supplier", gstNumber: "" },
  });

  async function onSubmit(values: SupplierFormData) {
    setServerError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, role: "supplier" },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/supplier`,
      },
    });

    if (error) {
      setServerError(
        error.message.includes("already registered")
          ? "This email is already registered. Try signing in."
          : error.message
      );
      return;
    }

    if (data.user) {
      await fetch("/api/auth/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
          role: "supplier",
          fullName: values.fullName,
          companyName: values.companyName,
          city: values.city,
          industry: values.industry,
          gstNumber: values.gstNumber,
          plan,
        }),
      });
    }

    onSuccess(values.email);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="hidden" {...register("role")} />

      {/* Selected plan badge */}
      {plan && PLAN_LABELS[plan] && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <ShieldCheck size={15} className="text-amber-600" />
          <span className="text-sm text-amber-800 font-medium">
            Selected plan: {PLAN_LABELS[plan]}
          </span>
        </div>
      )}

      {serverError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Your Name (Contact Person) *
        </label>
        <input
          {...register("fullName")}
          type="text"
          autoComplete="name"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
            errors.fullName ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          placeholder="Your full name"
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Company / Factory Name *
        </label>
        <input
          {...register("companyName")}
          type="text"
          autoComplete="organization"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
            errors.companyName ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          placeholder="e.g. Mehta Textiles Pvt. Ltd."
        />
        {errors.companyName && (
          <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            City *
          </label>
          <div className="relative">
            <select
              {...register("city")}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold appearance-none bg-white transition-colors ${
                errors.city ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="">Select city</option>
              {GUJARAT_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          {errors.city && (
            <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Industry *
          </label>
          <div className="relative">
            <select
              {...register("industry")}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold appearance-none bg-white transition-colors ${
                errors.industry ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="">Select</option>
              {INDUSTRIES.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          {errors.industry && (
            <p className="text-xs text-red-500 mt-1">{errors.industry.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          GST Number{" "}
          <span className="text-gray-400 font-normal">(optional but recommended)</span>
        </label>
        <input
          {...register("gstNumber")}
          type="text"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold uppercase tracking-widest transition-colors ${
            errors.gstNumber ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          placeholder="22AAAAA0000A1Z5"
          maxLength={15}
        />
        {errors.gstNumber ? (
          <p className="text-xs text-red-500 mt-1">{errors.gstNumber.message}</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">
            Helps verify your business authenticity
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address *
        </label>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
            errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password *
        </label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className={`w-full px-4 py-2.5 pr-11 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
              errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <p className="text-xs text-gray-400">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="text-trust hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-trust hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-trust text-white font-bold py-3 rounded-xl hover:bg-trust/90 transition-colors disabled:opacity-60 flex items-center justify-center"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          "Create Supplier Account"
        )}
      </button>
    </form>
  );
}

// --------------- Success State ---------------
function SuccessState({
  email,
  role,
}: {
  email: string;
  role: "buyer" | "supplier";
}) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={32} className="text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold text-ink mb-2">Check Your Email</h2>
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
        We sent a confirmation link to{" "}
        <strong className="text-ink">{email}</strong>. Click it to activate
        your account and{" "}
        {role === "supplier"
          ? "start your verification process."
          : "start finding verified Gujarat suppliers."}
      </p>
      <p className="text-xs text-gray-400 mt-4">
        Didn&apos;t receive it? Check your spam folder or{" "}
        <Link href="/auth/login" className="text-trust hover:underline">
          try signing in
        </Link>
        .
      </p>
    </div>
  );
}

// --------------- Main Form Wrapper ---------------
function SignupFormWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") as "buyer" | "supplier" | null;
  const planParam = searchParams.get("plan") ?? "bronze";

  const [role, setRole] = useState<"buyer" | "supplier">(
    roleParam === "supplier" ? "supplier" : "buyer"
  );
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  // After supplier or buyer sets up, redirect quickly for auto-confirmed accounts
  async function handleSuccess(email: string) {
    setSuccessEmail(email);
    // Give email-confirmed accounts a moment then try redirecting
    setTimeout(() => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          router.push(
            role === "supplier" ? "/dashboard/supplier" : "/dashboard/buyer"
          );
          router.refresh();
        }
      });
    }, 2000);
  }

  if (successEmail) {
    return <SuccessState email={successEmail} role={role} />;
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

      {role === "buyer" ? (
        <BuyerSignupForm onSuccess={handleSuccess} />
      ) : (
        <SupplierSignupForm plan={planParam} onSuccess={handleSuccess} />
      )}
    </>
  );
}

// --------------- Page ---------------
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
          <Suspense
            fallback={
              <div className="h-48 animate-pulse bg-paper rounded-xl" />
            }
          >
            <SignupFormWrapper />
          </Suspense>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-trust font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
