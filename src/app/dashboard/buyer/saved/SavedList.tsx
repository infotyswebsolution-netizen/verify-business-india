"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Bookmark,
  BookmarkX,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { createClient } from "@/lib/supabase/client";

export interface SavedSupplierRow {
  savedId: string;
  supplierId: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  industry: string;
  tier: string | null;
  verified_at: string | null;
  description: string | null;
  min_order_value: number | null;
  min_order_currency: string;
  export_capability: boolean;
}

interface Props {
  items: SavedSupplierRow[];
  buyerId: string;
}

export function SavedList({ items, buyerId }: Props) {
  const [saved, setSaved] = useState(items);
  const [unsaving, setUnsaving] = useState<string | null>(null);

  async function handleUnsave(savedId: string, supplierName: string) {
    if (!confirm(`Remove ${supplierName} from saved suppliers?`)) return;
    setUnsaving(savedId);

    const supabase = createClient();
    const { error } = await supabase
      .from("saved_suppliers")
      .delete()
      .eq("id", savedId);

    if (!error) {
      setSaved((prev) => prev.filter((s) => s.savedId !== savedId));
    }
    setUnsaving(null);
  }

  if (saved.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <Bookmark size={36} className="text-gray-200 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-600 mb-1">No saved suppliers</h3>
        <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
          Browse verified suppliers and bookmark the ones that look interesting.
        </p>
        <Link
          href="/suppliers"
          className="inline-flex items-center gap-2 bg-trust text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-trust/90 transition-colors"
        >
          Browse Suppliers
        </Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {saved.map((supplier) => (
        <div
          key={supplier.savedId}
          className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="font-semibold text-sm text-ink truncate">
                  {supplier.name}
                </h3>
                {supplier.tier && (
                  <VerificationBadge
                    tier={supplier.tier as "bronze" | "silver" | "gold"}
                    size="sm"
                  />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {supplier.city}, {supplier.state}
                </span>
                <span className="text-gray-300">·</span>
                <span className="truncate">{supplier.industry}</span>
              </div>
            </div>
            <button
              onClick={() => handleUnsave(supplier.savedId, supplier.name)}
              disabled={unsaving === supplier.savedId}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 disabled:opacity-40"
              title="Remove from saved"
            >
              {unsaving === supplier.savedId ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <BookmarkX size={16} />
              )}
            </button>
          </div>

          {/* Description */}
          {supplier.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
              {supplier.description}
            </p>
          )}

          {/* Details row */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 flex-wrap">
            {supplier.verified_at && (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck size={11} />
                Verified
              </span>
            )}
            {supplier.min_order_value && (
              <span>
                MOQ: {supplier.min_order_currency} {supplier.min_order_value.toLocaleString()}
              </span>
            )}
            {supplier.export_capability && (
              <span className="text-blue-600 font-medium">Exports</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Link
              href={`/suppliers/${supplier.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl hover:bg-paper transition-colors"
            >
              <ExternalLink size={12} />
              View Profile
            </Link>
            <Link
              href={`/inquiry/${supplier.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-trust text-white text-xs font-semibold py-2 rounded-xl hover:bg-trust/90 transition-colors"
            >
              <MessageSquare size={12} />
              Send Inquiry
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
