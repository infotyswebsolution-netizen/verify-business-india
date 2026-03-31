import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Package } from "lucide-react";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { cn } from "@/lib/utils";
import type { Supplier } from "@/types/database";

interface SupplierCardProps {
  supplier: Supplier & {
    review_count?: number;
    avg_rating?: number;
    primary_photo?: string;
  };
  className?: string;
}

export function SupplierCard({ supplier, className }: SupplierCardProps) {
  const rating = supplier.avg_rating ?? 0;
  const reviewCount = supplier.review_count ?? 0;

  return (
    <Link
      href={`/suppliers/${supplier.slug}`}
      className={cn(
        "group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold/30 transition-all overflow-hidden",
        className
      )}
    >
      {/* Photo */}
      <div className="relative h-48 bg-paper-dark overflow-hidden">
        {supplier.primary_photo ? (
          <Image
            src={supplier.primary_photo}
            alt={`${supplier.name} factory`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-paper to-paper-dark">
            <Package size={40} className="text-gray-300" />
          </div>
        )}
        {supplier.featured && (
          <div className="absolute top-3 left-3 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        {supplier.tier && (
          <div className="absolute top-3 right-3">
            <VerificationBadge tier={supplier.tier} size="sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-ink text-base leading-tight group-hover:text-trust transition-colors line-clamp-1">
            {supplier.name}
          </h3>
          {supplier.verification_score && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex-shrink-0">
              {supplier.verification_score}/100
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={11} />
          <span>{supplier.city}, Gujarat</span>
          <span className="mx-1">·</span>
          <span className="capitalize">{supplier.industry}</span>
        </div>

        {/* Product categories */}
        {supplier.product_categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {supplier.product_categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-xs bg-paper px-2 py-0.5 rounded-full text-gray-600 border border-paper-dark"
              >
                {cat}
              </span>
            ))}
            {supplier.product_categories.length > 3 && (
              <span className="text-xs text-gray-400">
                +{supplier.product_categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            {reviewCount > 0 ? (
              <>
                <Star
                  size={12}
                  className="text-amber-400 fill-amber-400"
                />
                <span className="text-xs font-semibold text-gray-700">
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  ({reviewCount})
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-400">No reviews yet</span>
            )}
          </div>
          {supplier.export_capability && (
            <span className="text-xs text-trust font-medium">
              Exports Globally
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
