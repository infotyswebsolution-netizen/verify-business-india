"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Package,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";

const schema = z.object({
  subject: z.string().min(3, "Enter a subject (min 3 characters)").max(120),
  sourcing: z
    .string()
    .min(20, "Please describe what you need (at least 20 characters)")
    .max(2000),
  quantity: z.string().max(100).optional(),
  budget: z.enum(["under_5k", "5k_25k", "25k_100k", "100k_plus"], {
    message: "Select a budget range",
  }),
  timeline: z.enum(["asap", "1_month", "3_months", "6_plus"], {
    message: "Select a timeline",
  }),
});

type FormData = z.infer<typeof schema>;

const BUDGET_OPTIONS = [
  { value: "under_5k", label: "Under $5,000" },
  { value: "5k_25k", label: "$5,000 – $25,000" },
  { value: "25k_100k", label: "$25,000 – $100,000" },
  { value: "100k_plus", label: "$100,000+" },
] as const;

const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "1_month", label: "Within 1 month" },
  { value: "3_months", label: "Within 3 months" },
  { value: "6_plus", label: "6+ months" },
] as const;

interface Props {
  supplierSlug: string;
  supplierId: string;
  supplierName: string;
}

export default function InquiryForm({ supplierSlug, supplierId, supplierName }: Props) {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormData) {
    setServerError(null);

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, supplierSlug, supplierId }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">Inquiry Sent!</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          Your inquiry has been sent to <strong className="text-ink">{supplierName}</strong>.
          They will respond within 24 hours.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => router.push("/dashboard/buyer/inquiries")}
            className="px-5 py-2.5 bg-trust text-white text-sm font-semibold rounded-xl hover:bg-trust/90 transition-colors"
          >
            View My Inquiries
          </button>
          <button
            onClick={() => router.push(`/suppliers/${supplierSlug}`)}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-paper transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          {serverError}
        </div>
      )}

      {/* Subject */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
          <FileText size={14} className="text-gray-400" />
          Subject *
        </label>
        <input
          {...register("subject")}
          type="text"
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors ${
            errors.subject ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          placeholder="e.g. Wholesale order inquiry — synthetic fabrics"
        />
        {errors.subject && (
          <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* Sourcing description */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
          <Package size={14} className="text-gray-400" />
          What are you sourcing? *
        </label>
        <textarea
          {...register("sourcing")}
          rows={4}
          className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors resize-none ${
            errors.sourcing ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
          placeholder="Describe the products you need, quality requirements, specifications, certifications required, and any other important details..."
        />
        {errors.sourcing ? (
          <p className="text-xs text-red-500 mt-1">{errors.sourcing.message}</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">
            Be specific — better descriptions get faster, more accurate quotes.
          </p>
        )}
      </div>

      {/* Quantity + Budget side-by-side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <Package size={14} className="text-gray-400" />
            Estimated Quantity
          </label>
          <input
            {...register("quantity")}
            type="text"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors"
            placeholder="e.g. 500 units"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
            <DollarSign size={14} className="text-gray-400" />
            Budget Range *
          </label>
          <div className="relative">
            <select
              {...register("budget")}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold appearance-none bg-white transition-colors ${
                errors.budget ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="">Select range</option>
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          {errors.budget && (
            <p className="text-xs text-red-500 mt-1">{errors.budget.message}</p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
          <Clock size={14} className="text-gray-400" />
          Required Timeline *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIMELINE_OPTIONS.map((o) => (
            <label
              key={o.value}
              className="relative cursor-pointer"
            >
              <input
                {...register("timeline")}
                type="radio"
                value={o.value}
                className="sr-only peer"
              />
              <div className="border border-gray-200 rounded-xl px-3 py-2.5 text-center text-xs font-medium text-gray-600 hover:border-trust/40 transition-colors peer-checked:border-trust peer-checked:bg-trust/5 peer-checked:text-trust">
                {o.label}
              </div>
            </label>
          ))}
        </div>
        {errors.timeline && (
          <p className="text-xs text-red-500 mt-1">{errors.timeline.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-trust text-white font-bold py-3.5 rounded-xl hover:bg-trust/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send size={16} />
            Send Inquiry to {supplierName}
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Your contact details will be shared with the supplier only.
        We never sell or share your data.
      </p>
    </form>
  );
}
