"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { X, Plus, Upload, Trash2, ImageIcon, Loader2, Save } from "lucide-react";

// ──────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────
export interface SupplierData {
  id: string;
  name: string;
  description: string | null;
  production_volume: string | null;
  min_order_value: number | null;
  min_order_currency: string;
  lead_time_days: number | null;
  export_capability: boolean;
  export_countries: string[];
  product_categories: string[];
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
}

export interface MediaItem {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
}

// ──────────────────────────────────────────────────────
// Chip input
// ──────────────────────────────────────────────────────
function ChipInput({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addChip(raw: string) {
    const val = raw.trim();
    if (val && !values.includes(val)) {
      onChange([...values, val]);
    }
    setInput("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(input);
    }
    if (e.key === "Backspace" && input === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="min-h-[46px] flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-gold/40 focus-within:border-gold transition-colors bg-white">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 bg-trust/10 text-trust text-xs font-medium px-2.5 py-1 rounded-lg">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="hover:text-red-500 transition-colors ml-0.5">
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => addChip(input)}
          placeholder={values.length === 0 ? placeholder : "Add more…"}
          className="flex-1 min-w-[140px] text-sm outline-none bg-transparent px-1 py-0.5 placeholder:text-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Section wrapper
// ──────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-ink text-sm uppercase tracking-wide mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors";

// ──────────────────────────────────────────────────────
// Main form
// ──────────────────────────────────────────────────────
interface Props {
  supplier: SupplierData;
  media: MediaItem[];
}

export function ProfileForm({ supplier, media: initialMedia }: Props) {
  // Form state
  const [name, setName] = useState(supplier.name);
  const [description, setDescription] = useState(supplier.description ?? "");
  const [productionVolume, setProductionVolume] = useState(supplier.production_volume ?? "");
  const [minOrder, setMinOrder] = useState(supplier.min_order_value?.toString() ?? "");
  const [leadTime, setLeadTime] = useState(supplier.lead_time_days?.toString() ?? "");
  const [exportCapability, setExportCapability] = useState(supplier.export_capability);
  const [exportCountries, setExportCountries] = useState<string[]>(supplier.export_countries);
  const [productCategories, setProductCategories] = useState<string[]>(supplier.product_categories);
  const [phone, setPhone] = useState(supplier.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(supplier.whatsapp ?? "");
  const [email, setEmail] = useState(supplier.email ?? "");
  const [website, setWebsite] = useState(supplier.website ?? "");

  const [saving, setSaving] = useState(false);

  // Photos state
  const [photos, setPhotos] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim() || null,
        production_volume: productionVolume.trim() || null,
        min_order_value: minOrder ? parseFloat(minOrder) : null,
        lead_time_days: leadTime ? parseInt(leadTime) : null,
        export_capability: exportCapability,
        export_countries: exportCountries,
        product_categories: productCategories,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        email: email.trim() || null,
        website: website.trim() || null,
      };

      const res = await fetch(`/api/suppliers/${supplier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Save failed");
      }

      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { media } = await res.json();
        setPhotos((prev) => [...prev, media]);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error ?? "Upload failed");
      }
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDeletePhoto(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/upload/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Photo deleted");
    } else {
      toast.error("Failed to delete photo");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-5">

      {/* ── Basic Info ── */}
      <Section title="Basic Info">
        <div className="space-y-4">
          <Field label="Company / Factory Name *">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`${inputCls} resize-none`}
              placeholder="Describe your factory, capabilities, history, and what makes you unique. Aim for 100–300 words."
            />
            <p className="text-xs text-gray-400 mt-1">{description.length} chars — aim for 150+ for best SEO</p>
          </Field>
        </div>
      </Section>

      {/* ── Products & Capacity ── */}
      <Section title="Products & Capacity">
        <div className="space-y-4">
          <ChipInput
            label="Product Categories"
            placeholder="e.g. Synthetic Fabrics, Georgette, Sarees"
            values={productCategories}
            onChange={setProductCategories}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Minimum Order (USD)">
              <input type="number" min="0" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className={inputCls} placeholder="e.g. 500" />
            </Field>
            <Field label="Lead Time (days)">
              <input type="number" min="0" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} className={inputCls} placeholder="e.g. 21" />
            </Field>
          </div>
          <Field label="Production Volume / Capacity">
            <input type="text" value={productionVolume} onChange={(e) => setProductionVolume(e.target.value)} className={inputCls} placeholder="e.g. 50,000 meters/month" />
          </Field>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="export"
              checked={exportCapability}
              onChange={(e) => setExportCapability(e.target.checked)}
              className="w-4 h-4 accent-trust rounded"
            />
            <label htmlFor="export" className="text-sm font-medium text-gray-700">
              We export internationally
            </label>
          </div>
          {exportCapability && (
            <ChipInput
              label="Export Countries"
              placeholder="e.g. USA, Canada, Germany, UK"
              values={exportCountries}
              onChange={setExportCountries}
            />
          )}
        </div>
      </Section>

      {/* ── Contact ── */}
      <Section title="Contact Details">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
          </Field>
          <Field label="WhatsApp">
            <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Business Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="exports@yourfactory.com" />
          </Field>
          <Field label="Website">
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} placeholder="https://yourfactory.com" />
          </Field>
        </div>
      </Section>

      {/* ── Photos ── */}
      <Section title={`Factory Photos (${photos.length})`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-paper">
              <Image src={photo.url} alt={photo.caption ?? "Factory photo"} fill className="object-cover" sizes="200px" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  disabled={deletingId === photo.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === photo.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}

          {/* Upload slot */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-trust/40 hover:bg-trust/5 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-trust disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <>
                <Upload size={22} />
                <span className="text-xs font-medium">Upload</span>
              </>
            )}
          </button>
        </div>

        {photos.length === 0 && !uploading && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
            <ImageIcon size={16} />
            <span>Add at least 1 photo to unlock the &ldquo;photos&rdquo; completion points (+20%)</span>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-paper transition-colors disabled:opacity-50"
        >
          <Plus size={15} />
          Upload Photos
        </button>
        <p className="text-xs text-gray-400 mt-2">JPG, PNG, WebP up to 8 MB each. Max recommended: 20 photos.</p>
      </Section>

      {/* ── Save button ── */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-trust text-white font-bold px-8 py-3 rounded-xl hover:bg-trust/90 transition-colors disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
