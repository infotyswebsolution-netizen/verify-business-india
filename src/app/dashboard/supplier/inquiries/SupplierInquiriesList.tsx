"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";

type Status = "pending" | "accepted" | "declined";

export interface SupplierInquiry {
  id: string;
  created_at: string;
  status: Status;
  message: string;
  product_interest: string | null;
  estimated_order_value: number | null;
  supplier_response: string | null;
  responded_at: string | null;
  buyer_company: string;
  buyer_country: string;
}

const STATUS_CONFIG = {
  pending: { label: "Pending Reply", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
  accepted: { label: "Accepted", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined: { label: "Declined", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
} as const;

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
] as const;

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatValue(v: number) {
  if (v >= 100000) return "$100,000+";
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v.toLocaleString()}`;
}

function InquiryCard({
  inquiry,
  defaultOpen,
  onResponded,
}: {
  inquiry: SupplierInquiry;
  defaultOpen: boolean;
  onResponded: (id: string, response: string, status: Status) => void;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [responding, setResponding] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subjectLine = inquiry.message.split("\n")[0] ?? "";
  const subject = subjectLine.startsWith("Subject: ") ? subjectLine.replace("Subject: ", "") : "Inquiry";

  const bodyLines = inquiry.message.split("\n").slice(2).filter((l) => l.trim());

  async function handleSubmitResponse(chosenStatus: "accepted" | "declined") {
    if (!responseText.trim()) {
      toast.error("Please write a response before submitting");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responseText.trim(), status: chosenStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to submit response");
      }
      toast.success(chosenStatus === "accepted" ? "Inquiry accepted!" : "Inquiry declined");
      onResponded(inquiry.id, responseText.trim(), chosenStatus);
      setResponding(false);
      setResponseText("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start gap-4"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Building2 size={16} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm text-ink">{inquiry.buyer_company}</span>
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <MapPin size={10} />
              {inquiry.buyer_country}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">{subject}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={10} />
              {formatDate(inquiry.created_at)}
            </span>
            {inquiry.estimated_order_value && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <DollarSign size={10} />
                {formatValue(inquiry.estimated_order_value)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={inquiry.status} />
          {expanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 pb-5">
          {/* Buyer message */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Buyer&apos;s Message</p>
            {inquiry.product_interest && (
              <p className="text-sm text-gray-700 leading-relaxed bg-paper rounded-xl p-4 whitespace-pre-line">
                {inquiry.product_interest}
              </p>
            )}
            {bodyLines.length > 0 && (
              <div className="mt-2 space-y-0.5">
                {bodyLines.map((line, i) => (
                  <p key={i} className="text-xs text-gray-500">{line}</p>
                ))}
              </div>
            )}
          </div>

          {/* Existing response or respond form */}
          {inquiry.supplier_response ? (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Your Response — {inquiry.responded_at && formatDate(inquiry.responded_at)}
              </p>
              <div className="bg-emerald-50 border border-emerald-100 border-l-4 border-l-emerald-400 rounded-xl p-4">
                <p className="text-sm text-gray-700 whitespace-pre-line">{inquiry.supplier_response}</p>
              </div>
            </div>
          ) : inquiry.status === "pending" ? (
            <div className="mt-4">
              {!responding ? (
                <button
                  onClick={() => setResponding(true)}
                  className="inline-flex items-center gap-2 bg-trust text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-trust/90 transition-colors"
                >
                  <MessageSquare size={15} />
                  Respond to this Inquiry
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Write your response</p>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={5}
                    autoFocus
                    placeholder="Introduce yourself, confirm availability, share pricing info, and invite further discussion..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSubmitResponse("accepted")}
                      disabled={submitting}
                      className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                    >
                      {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Accept &amp; Reply
                    </button>
                    <button
                      onClick={() => handleSubmitResponse("declined")}
                      disabled={submitting}
                      className="flex items-center gap-2 border border-red-200 text-red-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60"
                    >
                      <XCircle size={14} />
                      Decline
                    </button>
                    <button
                      onClick={() => { setResponding(false); setResponseText(""); }}
                      className="text-sm text-gray-400 hover:text-gray-600 px-3"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">The buyer will receive an email notification when you respond.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

interface Props {
  inquiries: SupplierInquiry[];
  selectedId?: string | null;
}

export function SupplierInquiriesList({ inquiries, selectedId }: Props) {
  const [items, setItems] = useState(inquiries);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]["key"]>("all");

  function handleResponded(id: string, response: string, status: Status) {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, supplier_response: response, status, responded_at: new Date().toISOString() } : i)
    );
  }

  const filtered = activeTab === "all" ? items : items.filter((i) => i.status === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-5 w-fit">
        {TABS.map((tab) => {
          const count = tab.key === "all" ? items.length : items.filter((i) => i.status === tab.key).length;
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
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Send size={28} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium mb-1">No {activeTab !== "all" ? activeTab : ""} inquiries</p>
          <p className="text-sm text-gray-400">
            {activeTab === "all" ? "Inquiries from buyers will appear here." : `No ${activeTab} inquiries yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <InquiryCard
              key={inq.id}
              inquiry={inq}
              defaultOpen={inq.id === selectedId}
              onResponded={handleResponded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
