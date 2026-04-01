import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm, SupplierData, MediaItem } from "./ProfileForm";

export const metadata: Metadata = { title: "Edit Profile" };
export const dynamic = "force-dynamic";

export default async function SupplierProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id, name, description, production_volume, min_order_value, min_order_currency, lead_time_days, export_capability, export_countries, product_categories, phone, whatsapp, email, website")
    .eq("user_id", user.id)
    .single();

  if (!supplier) redirect("/dashboard/supplier");

  const { data: mediaRows } = await supabase
    .from("supplier_media")
    .select("id, url, caption, sort_order")
    .eq("supplier_id", supplier.id)
    .eq("type", "photo")
    .order("sort_order", { ascending: true });

  const supplierData: SupplierData = {
    id: supplier.id,
    name: supplier.name,
    description: supplier.description,
    production_volume: supplier.production_volume,
    min_order_value: supplier.min_order_value,
    min_order_currency: supplier.min_order_currency ?? "USD",
    lead_time_days: supplier.lead_time_days,
    export_capability: supplier.export_capability ?? false,
    export_countries: supplier.export_countries ?? [],
    product_categories: supplier.product_categories ?? [],
    phone: supplier.phone,
    whatsapp: supplier.whatsapp,
    email: supplier.email,
    website: supplier.website,
  };

  const media: MediaItem[] = (mediaRows ?? []).map((m) => ({
    id: m.id,
    url: m.url,
    caption: m.caption,
    sort_order: m.sort_order,
  }));

  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Edit Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Complete your profile to attract more buyers and improve your verification score.
          </p>
        </div>
        <ProfileForm supplier={supplierData} media={media} />
      </div>
    </div>
  );
}
