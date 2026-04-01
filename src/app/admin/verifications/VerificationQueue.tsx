"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  ClipboardList,
  ShieldOff,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SupplierRow {
  id: string;
  name: string;
  city: string | null;
  industry: string | null;
  tier: string | null;
  verification_status: string;
  created_at: string;
  email: string | null;
}

interface Props {
  suppliers: SupplierRow[];
}

// ─── 25-Point Checklist ───────────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  // Legal & Compliance (1-6)
  { id: 1, category: "Legal & Compliance", label: "GST registration certificate verified" },
  { id: 2, category: "Legal & Compliance", label: "Company/firm registration documents valid" },
  { id: 3, category: "Legal & Compliance", label: "Factory license (if applicable) present" },
  { id: 4, category: "Legal & Compliance", label: "No pending major legal disputes disclosed" },
  { id: 5, category: "Legal & Compliance", label: "Director/owner identity verified (Aadhaar/PAN)" },
  { id: 6, category: "Legal & Compliance", label: "Import-Export Code (IEC) verified (if exporter)" },
  // Facility & Infrastructure (7-12)
  { id: 7, category: "Facility & Infrastructure", label: "Factory physical address matches registration" },
  { id: 8, category: "Facility & Infrastructure", label: "Production floor size adequate for claimed capacity" },
  { id: 9, category: "Facility & Infrastructure", label: "Key machinery and equipment operational" },
  { id: 10, category: "Facility & Infrastructure", label: "Power supply and backup adequate" },
  { id: 11, category: "Facility & Infrastructure", label: "Worker safety measures in place" },
  { id: 12, category: "Facility & Infrastructure", label: "Storage/warehouse conditions acceptable" },
  // Quality Management (13-17)
  { id: 13, category: "Quality Management", label: "Quality control processes documented and practiced" },
  { id: 14, category: "Quality Management", label: "Sample production capability demonstrated" },
  { id: 15, category: "Quality Management", label: "Product testing records available" },
  { id: 16, category: "Quality Management", label: "ISO or equivalent certification held (if claimed)" },
  { id: 17, category: "Quality Management", label: "Customer complaint handling process exists" },
  // Financial Stability (18-20)
  { id: 18, category: "Financial Stability", label: "Active business bank account verified" },
  { id: 19, category: "Financial Stability", label: "Financial solvency confirmed (no insolvency proceedings)" },
  { id: 20, category: "Financial Stability", label: "Consistent trading history (minimum 1 year)" },
  // Export Capability (21-23)
  { id: 21, category: "Export Capability", label: "Export experience or capability confirmed" },
  { id: 22, category: "Export Capability", label: "International shipping documentation capability" },
  { id: 23, category: "Export Capability", label: "Foreign currency transaction account available" },
  // Business Operations (24-25)
  { id: 24, category: "Business Operations", label: "Owner/director interview completed" },
  { id: 25, category: "Business Operations", label: "Staff count and roles verified on-site" },
];

type ChecklistResult = "pass" | "fail" | "partial";

interface ChecklistState {
  [id: number]: ChecklistResult;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700", icon: Clock },
  under_review: { label: "Under Review", color: "bg-blue-50 text-blue-700", icon: ClipboardList },
  verified: { label: "Verified", color: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  suspended: { label: "Suspended", color: "bg-red-50 text-red-600", icon: XCircle },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const TIER_COLORS: Record<string, string> = {
  gold: "bg-amber-50 text-amber-700",
  silver: "bg-slate-100 text-slate-600",
  bronze: "bg-orange-50 text-orange-700",
};

// ─── Modal wrapper ────────────────────────────────────────────────────────────

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-paper hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ─── Schedule Audit Modal ─────────────────────────────────────────────────────

function ScheduleModal({
  supplier,
  onClose,
  onDone,
}: {
  supplier: SupplierRow;
  onClose: () => void;
  onDone: (id: string) => void;
}) {
  const [auditDate, setAuditDate] = useState("");
  const [auditorName, setAuditorName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!auditDate || !auditorName.trim()) {
      toast.error("Audit date and auditor name are required");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/admin/suppliers/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplier_id: supplier.id,
        audit_date: auditDate,
        auditor_name: auditorName.trim(),
        notes: notes.trim() || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err?.error ?? "Failed to schedule audit");
      return;
    }
    toast.success(`Audit scheduled for ${supplier.name}`);
    onDone(supplier.id);
    onClose();
  }

  return (
    <Modal title={`Schedule Audit — ${supplier.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Audit Date *
          </label>
          <input
            type="date"
            value={auditDate}
            onChange={(e) => setAuditDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-trust/40"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Auditor Name *
          </label>
          <input
            type="text"
            value={auditorName}
            onChange={(e) => setAuditorName(e.target.value)}
            placeholder="e.g. Rajesh Patel"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-trust/40"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Notes to supplier (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Please keep all documents ready"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-ink resize-none focus:outline-none focus:ring-2 focus:ring-trust/40"
          />
        </div>
        <p className="text-xs text-gray-400">
          The supplier will receive an email with the audit date and auditor name.
          Their status will change to &ldquo;Under Review&rdquo;.
        </p>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-paper transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-trust text-white rounded-xl py-2.5 text-sm font-bold disabled:opacity-60 hover:bg-trust/90 transition-colors"
          >
            {loading ? "Scheduling…" : "Schedule Audit"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Complete Audit Modal ─────────────────────────────────────────────────────

const CHECKLIST_CATEGORIES = Array.from(
  new Set(CHECKLIST_ITEMS.map((i) => i.category))
);

function CompleteAuditModal({
  supplier,
  onClose,
  onDone,
}: {
  supplier: SupplierRow;
  onClose: () => void;
  onDone: (id: string) => void;
}) {
  const [score, setScore] = useState(75);
  const [tier, setTier] = useState<"bronze" | "silver" | "gold">("bronze");
  const [checklist, setChecklist] = useState<ChecklistState>(() =>
    Object.fromEntries(CHECKLIST_ITEMS.map((i) => [i.id, "pass" as ChecklistResult]))
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(
    CHECKLIST_CATEGORIES[0]
  );

  function setResult(id: number, result: ChecklistResult) {
    setChecklist((prev) => ({ ...prev, [id]: result }));
  }

  const passCount = Object.values(checklist).filter((v) => v === "pass").length;
  const partialCount = Object.values(checklist).filter((v) => v === "partial").length;
  const failCount = Object.values(checklist).filter((v) => v === "fail").length;

  async function handleSubmit() {
    setLoading(true);
    const checklistPayload = CHECKLIST_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      result: checklist[item.id],
    }));
    const res = await fetch("/api/admin/suppliers/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplier_id: supplier.id,
        score,
        tier,
        checklist: checklistPayload,
        notes: notes.trim() || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err?.error ?? "Failed to complete audit");
      return;
    }
    toast.success(`${supplier.name} is now ${tier.charAt(0).toUpperCase() + tier.slice(1)} Verified!`);
    onDone(supplier.id);
    onClose();
  }

  return (
    <Modal title={`Complete Audit — ${supplier.name}`} onClose={onClose}>
      <div className="space-y-5">
        {/* Score + Tier */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Audit Score (1–100) *
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-trust/40"
            />
            <p className="text-xs text-gray-400 mt-1">
              {score >= 75 ? "✓ Eligible for Gold" : score >= 60 ? "✓ Eligible for Silver" : "✓ Eligible for Bronze"}
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Verification Tier *
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as "bronze" | "silver" | "gold")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-trust/40"
            >
              <option value="bronze">Bronze (60–74)</option>
              <option value="silver">Silver (75–89)</option>
              <option value="gold">Gold (90–100)</option>
            </select>
          </div>
        </div>

        {/* Checklist summary */}
        <div className="flex gap-3 p-3 bg-paper rounded-xl text-xs font-medium">
          <span className="text-emerald-600">{passCount} Pass</span>
          <span className="text-amber-600">{partialCount} Partial</span>
          <span className="text-red-500">{failCount} Fail</span>
          <span className="ml-auto text-gray-400">{passCount + partialCount + failCount}/25</span>
        </div>

        {/* Checklist grouped by category */}
        <div className="space-y-2 border border-gray-100 rounded-xl overflow-hidden">
          {CHECKLIST_CATEGORIES.map((cat) => {
            const items = CHECKLIST_ITEMS.filter((i) => i.category === cat);
            const isOpen = expandedCat === cat;
            return (
              <div key={cat} className="border-b border-gray-50 last:border-0">
                <button
                  onClick={() => setExpandedCat(isOpen ? null : cat)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-paper transition-colors"
                >
                  {cat}
                  {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <span className="text-xs text-gray-400 w-5 flex-shrink-0 mt-0.5">
                          {item.id}.
                        </span>
                        <span className="flex-1 text-xs text-gray-700 leading-relaxed">
                          {item.label}
                        </span>
                        <div className="flex gap-1 flex-shrink-0">
                          {(["pass", "partial", "fail"] as ChecklistResult[]).map(
                            (r) => (
                              <button
                                key={r}
                                onClick={() => setResult(item.id, r)}
                                className={`text-xs px-2 py-0.5 rounded-md font-medium transition-colors ${
                                  checklist[item.id] === r
                                    ? r === "pass"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : r === "partial"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                }`}
                              >
                                {r === "pass" ? "✓" : r === "partial" ? "~" : "✗"}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Internal Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Observations for internal record…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-ink resize-none focus:outline-none focus:ring-2 focus:ring-trust/40"
          />
        </div>

        <p className="text-xs text-gray-400">
          Saving will set this supplier to <strong>Verified</strong>, insert an audit record, and send a congratulations email.
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-paper transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-bold disabled:opacity-60 hover:bg-emerald-700 transition-colors"
          >
            {loading ? "Saving…" : "Complete & Verify"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Suspend Confirm ──────────────────────────────────────────────────────────

function SuspendModal({
  supplier,
  onClose,
  onDone,
}: {
  supplier: SupplierRow;
  onClose: () => void;
  onDone: (id: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSuspend() {
    setLoading(true);
    const res = await fetch("/api/admin/suppliers/suspend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplier_id: supplier.id,
        reason: reason.trim() || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err?.error ?? "Failed to suspend supplier");
      return;
    }
    toast.success(`${supplier.name} has been suspended`);
    onDone(supplier.id);
    onClose();
  }

  return (
    <Modal title="Suspend Supplier" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-700">
            You are about to suspend <strong>{supplier.name}</strong>.
          </p>
          <p className="text-xs text-red-500 mt-1">
            Their public profile will be hidden and they will receive a suspension email.
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Reason (optional, included in email)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Failed to meet quality standards after repeated audits"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-ink resize-none focus:outline-none focus:ring-2 focus:ring-red-400/40"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-paper transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSuspend}
            disabled={loading}
            className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold disabled:opacity-60 hover:bg-red-700 transition-colors"
          >
            {loading ? "Suspending…" : "Suspend Supplier"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function VerificationQueue({ suppliers: initialSuppliers }: Props) {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [filter, setFilter] = useState<string>("pending,under_review");
  const [scheduleTarget, setScheduleTarget] = useState<SupplierRow | null>(null);
  const [completeTarget, setCompleteTarget] = useState<SupplierRow | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<SupplierRow | null>(null);

  function updateStatus(id: string, newStatus: string) {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verification_status: newStatus } : s))
    );
  }

  const filtered = (() => {
    if (filter === "pending,under_review") {
      return suppliers.filter(
        (s) => s.verification_status === "pending" || s.verification_status === "under_review"
      );
    }
    if (filter === "all") return suppliers;
    return suppliers.filter((s) => s.verification_status === filter);
  })();

  const counts = {
    queue: suppliers.filter(
      (s) => s.verification_status === "pending" || s.verification_status === "under_review"
    ).length,
    verified: suppliers.filter((s) => s.verification_status === "verified").length,
    suspended: suppliers.filter((s) => s.verification_status === "suspended").length,
    all: suppliers.length,
  };

  return (
    <>
      {/* Modals */}
      {scheduleTarget && (
        <ScheduleModal
          supplier={scheduleTarget}
          onClose={() => setScheduleTarget(null)}
          onDone={(id) => updateStatus(id, "under_review")}
        />
      )}
      {completeTarget && (
        <CompleteAuditModal
          supplier={completeTarget}
          onClose={() => setCompleteTarget(null)}
          onDone={(id) => updateStatus(id, "verified")}
        />
      )}
      {suspendTarget && (
        <SuspendModal
          supplier={suspendTarget}
          onClose={() => setSuspendTarget(null)}
          onDone={(id) => updateStatus(id, "suspended")}
        />
      )}

      {/* Pipeline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Needs Action", count: counts.queue, color: "text-amber-600" },
          { label: "Verified", count: counts.verified, color: "text-emerald-600" },
          { label: "Suspended", count: counts.suspended, color: "text-red-500" },
          { label: "Total", count: counts.all, color: "text-gray-600" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { val: "pending,under_review", label: "Needs Action" },
          { val: "pending", label: "Pending" },
          { val: "under_review", label: "Under Review" },
          { val: "verified", label: "Verified" },
          { val: "suspended", label: "Suspended" },
          { val: "all", label: "All" },
        ].map((t) => (
          <button
            key={t.val}
            onClick={() => setFilter(t.val)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              filter === t.val
                ? "bg-trust text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Supplier</th>
                <th className="text-left px-5 py-3">Plan</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Signed Up</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                    No suppliers in this filter.
                  </td>
                </tr>
              )}
              {filtered.map((supplier) => {
                const statusConf =
                  STATUS_CONFIG[supplier.verification_status] ?? STATUS_CONFIG["pending"];
                const StatusIcon = statusConf.icon;

                return (
                  <tr
                    key={supplier.id}
                    className="hover:bg-paper/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-ink">{supplier.name}</div>
                      <div className="text-xs text-gray-500">
                        {supplier.city}{supplier.industry ? ` · ${supplier.industry}` : ""}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {supplier.tier ? (
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                            TIER_COLORS[supplier.tier] ?? "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {supplier.tier}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusConf.color}`}
                      >
                        <StatusIcon size={11} />
                        {statusConf.label}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {formatDate(supplier.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {supplier.verification_status === "pending" && (
                          <button
                            onClick={() => setScheduleTarget(supplier)}
                            className="flex items-center gap-1 text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Calendar size={11} />
                            Schedule Audit
                          </button>
                        )}
                        {supplier.verification_status === "under_review" && (
                          <button
                            onClick={() => setCompleteTarget(supplier)}
                            className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <ClipboardList size={11} />
                            Complete Audit
                          </button>
                        )}
                        {supplier.verification_status !== "suspended" && (
                          <button
                            onClick={() => setSuspendTarget(supplier)}
                            className="flex items-center gap-1 text-xs border border-red-100 text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Suspend supplier"
                          >
                            <ShieldOff size={11} />
                          </button>
                        )}
                        {supplier.verification_status === "suspended" && (
                          <span className="text-xs text-gray-400 italic">Suspended</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
