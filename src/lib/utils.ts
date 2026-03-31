import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function getVerificationTierColor(
  tier: string | null
): { bg: string; text: string; border: string } {
  switch (tier) {
    case "gold":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-300",
      };
    case "silver":
      return {
        bg: "bg-slate-50",
        text: "text-slate-600",
        border: "border-slate-300",
      };
    case "bronze":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-300",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-500",
        border: "border-gray-200",
      };
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export const GUJARAT_CITIES = [
  "Ahmedabad",
  "Surat",
  "Rajkot",
  "Vadodara",
  "Gandhinagar",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Anand",
  "Morbi",
  "Mehsana",
  "Other Gujarat",
];

export const INDUSTRIES = [
  { value: "textiles", label: "Textiles & Fabrics" },
  { value: "diamonds", label: "Diamonds & Gems" },
  { value: "metals", label: "Metals & Welding" },
  { value: "chemicals", label: "Chemicals" },
  { value: "pharmaceuticals", label: "Pharmaceuticals" },
  { value: "plastics", label: "Plastics & Polymers" },
  { value: "engineering", label: "Engineering & Machinery" },
  { value: "ceramics", label: "Ceramics & Tiles" },
  { value: "food", label: "Food Processing" },
  { value: "other", label: "Other" },
];

export const CERTIFICATIONS = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "GST Verified",
  "Export License",
  "MSME Registered",
  "GMP Certified",
  "BIS Certified",
  "CE Marking",
  "FDA Approved",
];
