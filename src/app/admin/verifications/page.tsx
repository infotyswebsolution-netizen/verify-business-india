import { Metadata } from "next";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Upload,
  Mail,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — Verification Queue",
};

const STATUS_CONFIG = {
  pending_review: {
    label: "Pending Review",
    color: "bg-gray-100 text-gray-600",
    icon: Clock,
  },
  audit_scheduled: {
    label: "Audit Scheduled",
    color: "bg-blue-50 text-blue-600",
    icon: Calendar,
  },
  audit_complete: {
    label: "Audit Complete",
    color: "bg-amber-50 text-amber-700",
    icon: Upload,
  },
  verified: {
    label: "Verified",
    color: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  suspended: {
    label: "Suspended",
    color: "bg-red-50 text-red-600",
    icon: XCircle,
  },
};

const DEMO_QUEUE = [
  {
    id: "1",
    name: "Gujarat Polymers Ltd",
    city: "Vadodara",
    industry: "Plastics",
    plan: "silver",
    signup_date: "2025-01-15",
    status: "pending_review",
    auditor: null,
    audit_date: null,
    score: null,
  },
  {
    id: "2",
    name: "Mehsana Steel Works",
    city: "Mehsana",
    industry: "Metals",
    plan: "bronze",
    signup_date: "2025-01-12",
    status: "audit_scheduled",
    auditor: "Rajesh Patel",
    audit_date: "2025-01-22",
    score: null,
  },
  {
    id: "3",
    name: "Surat Embroidery House",
    city: "Surat",
    industry: "Textiles",
    plan: "gold",
    signup_date: "2025-01-08",
    status: "audit_complete",
    auditor: "Priya Shah",
    audit_date: "2025-01-18",
    score: 87,
  },
  {
    id: "4",
    name: "Anand Dairy Equipment",
    city: "Anand",
    industry: "Engineering",
    plan: "silver",
    signup_date: "2025-01-05",
    status: "verified",
    auditor: "Amit Desai",
    audit_date: "2025-01-14",
    score: 81,
  },
  {
    id: "5",
    name: "Jamnagar Brass Parts",
    city: "Jamnagar",
    industry: "Metals",
    plan: "bronze",
    signup_date: "2024-12-28",
    status: "suspended",
    auditor: "Rajesh Patel",
    audit_date: "2025-01-06",
    score: 45,
  },
];

const AUDITORS = ["Rajesh Patel", "Priya Shah", "Amit Desai", "Neha Joshi"];

export default function VerificationQueuePage() {
  const counts = {
    pending: DEMO_QUEUE.filter((s) => s.status === "pending_review").length,
    scheduled: DEMO_QUEUE.filter((s) => s.status === "audit_scheduled").length,
    complete: DEMO_QUEUE.filter((s) => s.status === "audit_complete").length,
    verified: DEMO_QUEUE.filter((s) => s.status === "verified").length,
  };

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Verification Queue</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage supplier audit pipeline — assign auditors, upload reports, award badges.
          </p>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Review", count: counts.pending, color: "text-gray-600" },
            { label: "Audit Scheduled", count: counts.scheduled, color: "text-blue-600" },
            { label: "Audit Complete", count: counts.complete, color: "text-amber-600" },
            { label: "Verified This Month", count: counts.verified, color: "text-emerald-600" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Queue Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-ink">All Suppliers</h2>
            <div className="flex gap-2">
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gold/40">
                <option value="">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Supplier</th>
                  <th className="text-left px-5 py-3">Plan</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Auditor</th>
                  <th className="text-left px-5 py-3">Audit Date</th>
                  <th className="text-left px-5 py-3">Score</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DEMO_QUEUE.map((supplier) => {
                  const statusConf = STATUS_CONFIG[supplier.status as keyof typeof STATUS_CONFIG];
                  const StatusIcon = statusConf.icon;

                  return (
                    <tr key={supplier.id} className="hover:bg-paper/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-ink">{supplier.name}</div>
                        <div className="text-xs text-gray-500">
                          {supplier.city} · {supplier.industry}
                        </div>
                        <div className="text-xs text-gray-400">
                          Signed up {supplier.signup_date}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                          supplier.plan === "gold"
                            ? "bg-amber-50 text-amber-700"
                            : supplier.plan === "silver"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-orange-50 text-orange-700"
                        }`}>
                          {supplier.plan}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusConf.color}`}>
                          <StatusIcon size={11} />
                          {statusConf.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {supplier.status === "pending_review" ? (
                          <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gold/40">
                            <option value="">Assign auditor</option>
                            {AUDITORS.map((a) => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-gray-600">
                            {supplier.auditor ?? "—"}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-600">
                        {supplier.audit_date ?? "—"}
                      </td>

                      <td className="px-5 py-4">
                        {supplier.score !== null ? (
                          <span className={`text-sm font-bold ${
                            supplier.score >= 75
                              ? "text-emerald-600"
                              : supplier.score >= 60
                              ? "text-amber-600"
                              : "text-red-500"
                          }`}>
                            {supplier.score}/100
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {supplier.status === "audit_complete" && (
                            <button className="flex items-center gap-1 text-xs bg-trust text-white px-3 py-1.5 rounded-lg hover:bg-trust/90 transition-colors">
                              <CheckCircle2 size={11} />
                              Approve
                            </button>
                          )}
                          {supplier.status === "audit_scheduled" && (
                            <button className="flex items-center gap-1 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors">
                              <Upload size={11} />
                              Upload Report
                            </button>
                          )}
                          {supplier.status === "pending_review" && (
                            <button className="flex items-center gap-1 text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">
                              <Calendar size={11} />
                              Schedule
                            </button>
                          )}
                          <button className="flex items-center gap-1 text-xs border border-gray-200 text-gray-500 px-2 py-1.5 rounded-lg hover:border-gray-300 transition-colors">
                            <Mail size={11} />
                          </button>
                          {supplier.status !== "suspended" && (
                            <button className="flex items-center gap-1 text-xs border border-red-100 text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                              <AlertCircle size={11} />
                            </button>
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
      </div>
    </div>
  );
}
