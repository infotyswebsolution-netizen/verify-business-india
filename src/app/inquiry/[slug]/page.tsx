import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  LogIn,
  UserPlus,
  Building2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import InquiryForm from "./InquiryForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Send Inquiry | VerifyIndia`,
    description: `Contact a verified Gujarat supplier via VerifyIndia.`,
    robots: { index: false },
  };
}

export const dynamic = "force-dynamic";

export default async function InquiryPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch supplier by slug
  const { data: supplier, error: supplierError } = await supabase
    .from("suppliers")
    .select("id, name, slug, city, state, industry, tier, verified_at, status, email")
    .eq("slug", slug)
    .single();

  if (supplierError || !supplier) {
    notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get their profile role
  let userRole: string | null = null;
  let buyerAlreadySentInquiry = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    userRole = profile?.role ?? null;

    // Check if this buyer already sent an inquiry to this supplier
    if (userRole === "buyer") {
      const { data: buyer } = await supabase
        .from("buyers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (buyer) {
        const { data: existing } = await supabase
          .from("inquiries")
          .select("id")
          .eq("buyer_id", buyer.id)
          .eq("supplier_id", supplier.id)
          .maybeSingle();

        if (existing) {
          buyerAlreadySentInquiry = true;
        }
      }
    }
  }

  const isVerified = supplier.status === "verified" || !!supplier.verified_at;

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Supplier summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-trust/10 flex items-center justify-center flex-shrink-0">
              <Building2 size={24} className="text-trust" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-ink truncate">{supplier.name}</h1>
                {supplier.tier && (
                  <VerificationBadge tier={supplier.tier} size="sm" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <MapPin size={13} className="text-gray-400" />
                <span>{supplier.city}, {supplier.state}</span>
                <span className="text-gray-300">·</span>
                <span>{supplier.industry}</span>
              </div>
              {isVerified && (
                <div className="flex items-center gap-1.5 mt-2">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">
                    Verified by VerifyIndia
                  </span>
                </div>
              )}
            </div>
            <Link
              href={`/suppliers/${slug}`}
              className="text-xs text-trust hover:underline flex-shrink-0"
            >
              View profile
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {/* Not logged in */}
          {!user && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-trust/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={28} className="text-trust" />
              </div>
              <h2 className="text-xl font-bold text-ink mb-2">
                Create a free buyer account to contact this supplier
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                Register as a buyer to send inquiries, get quotes, and connect
                directly with verified Gujarat manufacturers.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/auth/signup?role=buyer`}
                  className="inline-flex items-center justify-center gap-2 bg-trust text-white font-bold px-6 py-3 rounded-xl hover:bg-trust/90 transition-colors"
                >
                  <UserPlus size={16} />
                  Create Free Buyer Account
                </Link>
                <Link
                  href={`/auth/login?redirectTo=/inquiry/${slug}`}
                  className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-paper transition-colors"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              </div>

              <p className="text-xs text-gray-400 mt-6">
                Free forever for buyers. No credit card required.
              </p>
            </div>
          )}

          {/* Logged in as supplier — can't send to themselves or others */}
          {user && userRole === "supplier" && (
            <div className="text-center py-6">
              <AlertCircle size={40} className="text-amber-400 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-ink mb-2">
                Supplier accounts can&apos;t send inquiries
              </h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Inquiries are for buyers only. If you&apos;re a buyer as well,
                please create a separate buyer account.
              </p>
              <Link
                href={`/suppliers/${slug}`}
                className="inline-block mt-4 text-sm text-trust hover:underline"
              >
                ← Back to supplier profile
              </Link>
            </div>
          )}

          {/* Already submitted */}
          {user && userRole === "buyer" && buyerAlreadySentInquiry && (
            <div className="text-center py-6">
              <ShieldCheck size={40} className="text-emerald-400 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-ink mb-2">
                You already have an inquiry with this supplier
              </h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Check your buyer dashboard to view the status and any response.
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <Link
                  href="/dashboard/buyer/inquiries"
                  className="inline-flex items-center gap-1.5 bg-trust text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-trust/90 transition-colors"
                >
                  View My Inquiries
                </Link>
                <Link
                  href={`/suppliers/${slug}`}
                  className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-paper transition-colors"
                >
                  Back to Profile
                </Link>
              </div>
            </div>
          )}

          {/* Buyer — show form */}
          {user && userRole === "buyer" && !buyerAlreadySentInquiry && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-ink mb-1">Send Inquiry</h2>
                <p className="text-sm text-gray-500">
                  Tell <strong>{supplier.name}</strong> exactly what you need.
                  Detailed inquiries get faster, more accurate quotes.
                </p>
              </div>
              <InquiryForm
                supplierSlug={supplier.slug}
                supplierId={supplier.id}
                supplierName={supplier.name}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
