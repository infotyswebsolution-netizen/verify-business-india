"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Building2,
  Calendar,
  Package,
  DollarSign,
} from "lucide-react";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

type InquiryStatus = "pending" | "accepted" | "declined";

export interface InquiryRow {
  id: string;
  created_at: string;
  status: InquiryStatus;
  message: string;
  product_interest: string | null;
  estimated_order_value: number | null;
  supplier_id: string;
  supplier_name: string;
  supplier_slug: string;
  supplier_tier: string | null;
  supplier_response: string | null;
  responded_at: string | null;
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
} as const;

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
] as const;

function StatusBadge({ status }: { status: InquiryStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  if (value >= 100000) return "$100,000+";
  if (value >= 25000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value.toLocaleString()}`;
}

function InquiryCard({ inquiry, defaultOpen }: { inquiry: InquiryRow; defaultOpen: boolean }) {
  const [expanded, setExpanded] = useState(defaultOpen);

  const subjectLine = inquiry.message.split("\n")[0] ?? "";
  const subject = subjectLine.startsWith("Subject: ")
    ? subjectLine.replace("Subject: ", "")
    : "Inquiry";

  // Extract body (skip first blank line and subject line)
  const messageLines = inquiry.message.split("\n");
  const bodyLines = messageLines.slice(2); // skip "Subject: X" and blank line

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all hover:border-gray-200">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start gap-4"
      >
        <div className="w-9 h-9 rounded-xl bg-trust/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Building2 size={16} className="text-trust" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-sm text-ink">
              {inquiry.supplier_name}
            </span>
            {inquiry.supplier_tier && (
              <VerificationBadge
                tier={inquiry.supplier_tier as "bronze" | "silver" | "gold"}
                size="sm"
              />
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">{subject}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} />
              {formatDate(inquiry.created_at)}
            </span>
            {inquiry.estimated_order_value && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <DollarSign size={11} />
                {formatCurrency(inquiry.estimated_order_value)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <StatusBadge status={inquiry.status} />
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 pb-5">
          {/* What you sent */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Your Inquiry
            </p>
            {inquiry.product_interest && (
              <p className="text-sm text-gray-700 leading-relaxed bg-paper rounded-xl p-4 whitespace-pre-line">
                {inquiry.product_interest}
              </p>
            )}
            {bodyLines.length > 0 && (
              <div className="mt-2 space-y-1">
                {bodyLines
                  .filter((l) => l.trim())
                  .map((line, i) => (
                    <p key={i} className="text-xs text-gray-500">
                      {line}
                    </p>
                  ))}
              </div>
            )}
          </div>

          {/* Supplier response */}
          {inquiry.supplier_response ? (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Supplier Response
                {inquiry.responded_at && (
                  <span className="ml-2 font-normal normal-case">
                    — {formatDate(inquiry.responded_at)}
                  </span>
                )}
              </p>
              <div className="bg-blue-50 border border-blue-100 border-l-4 border-l-blue-400 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {inquiry.supplier_response}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <Clock size={14} />
              <span>Awaiting supplier response — usually within 24 hours</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            <Link
              href={`/suppliers/${inquiry.supplier_slug}`}
              className="text-xs text-trust hover:underline font-medium"
            >
              View supplier profile →
            </Link>
            {inquiry.status === "pending" && (
              <span className="text-xs text-gray-300">·</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  inquiries: InquiryRow[];
  selectedId?: string | null;
}

export function InquiriesList({ inquiries, selectedId }: Props) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]["key"]>("all");

  const filtered =
    activeTab === "all"
      ? inquiries
      : inquiries.filter((i) => i.status === activeTab);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-5 w-fit">
        {TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? inquiries.length
              : inquiries.filter((i) => i.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-trust text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-paper"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <MessageSquare size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium mb-1">No inquiries here</p>
          <p className="text-sm text-gray-400">
            {activeTab === "all"
              ? "You haven't sent any inquiries yet."
              : `No ${activeTab} inquiries.`}
          </p>
          {activeTab === "all" && (
            <Link
              href="/suppliers"
              className="inline-flex items-center gap-1.5 mt-4 bg-trust text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-trust/90 transition-colors"
            >
              <Package size={14} />
              Browse Suppliers
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              defaultOpen={inquiry.id === selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
