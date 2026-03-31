"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck, Shield } from "lucide-react";

interface VerificationBadgeProps {
  tier: "bronze" | "silver" | "gold" | null;
  score?: number | null;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
  className?: string;
}

const TIER_CONFIG = {
  gold: {
    label: "Gold Verified",
    bg: "bg-amber-50 border-amber-300",
    text: "text-amber-700",
    icon: "text-amber-500",
    ring: "#C9A84C",
    ringBg: "#FEF3C7",
  },
  silver: {
    label: "Silver Verified",
    bg: "bg-slate-50 border-slate-300",
    text: "text-slate-600",
    icon: "text-slate-400",
    ring: "#94A3B8",
    ringBg: "#F1F5F9",
  },
  bronze: {
    label: "Bronze Verified",
    bg: "bg-orange-50 border-orange-300",
    text: "text-orange-700",
    icon: "text-orange-500",
    ring: "#CD7F32",
    ringBg: "#FFF7ED",
  },
};

const SIZE_CONFIG = {
  sm: { container: "px-2 py-1 text-xs gap-1", icon: 12, score: "text-xs" },
  md: { container: "px-3 py-1.5 text-sm gap-1.5", icon: 14, score: "text-sm" },
  lg: { container: "px-4 py-2 text-base gap-2", icon: 18, score: "text-base" },
};

export function VerificationBadge({
  tier,
  score,
  size = "md",
  showScore = false,
  className,
}: VerificationBadgeProps) {
  if (!tier) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium bg-gray-50 border-gray-200 text-gray-500",
          className
        )}
      >
        <Shield size={12} />
        Unverified
      </span>
    );
  }

  const config = TIER_CONFIG[tier];
  const sizeConf = SIZE_CONFIG[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        config.bg,
        config.text,
        sizeConf.container,
        className
      )}
    >
      <ShieldCheck size={sizeConf.icon} className={config.icon} />
      {config.label}
      {showScore && score !== null && score !== undefined && (
        <span className={cn("font-bold ml-1", sizeConf.score)}>
          {score}/100
        </span>
      )}
    </span>
  );
}

interface ScoreRingProps {
  score: number;
  size?: number;
  tier?: "bronze" | "silver" | "gold" | null;
}

export function ScoreRing({ score, size = 80, tier }: ScoreRingProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = tier
    ? TIER_CONFIG[tier].ring
    : score >= 80
    ? "#10B981"
    : score >= 60
    ? "#F59E0B"
    : "#EF4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="score-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-ink leading-none">{score}</span>
        <span className="text-xs text-gray-500 leading-none">/100</span>
      </div>
    </div>
  );
}
