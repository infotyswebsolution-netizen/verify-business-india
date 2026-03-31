export type VerificationTier = "bronze" | "silver" | "gold" | null;
export type SupplierStatus =
  | "pending_review"
  | "audit_scheduled"
  | "audit_complete"
  | "verified"
  | "suspended";
export type InquiryStatus = "pending" | "accepted" | "declined";
export type UserRole = "buyer" | "supplier" | "admin";

export interface Supplier {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  gst_number: string | null;
  city: string;
  state: string;
  industry: string;
  description: string | null;
  verification_score: number | null;
  verified_at: string | null;
  tier: VerificationTier;
  status: SupplierStatus;
  min_order_value: number | null;
  min_order_currency: string;
  lead_time_days: number | null;
  production_volume: string | null;
  export_capability: boolean;
  export_countries: string[];
  product_categories: string[];
  website: string | null;
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
  user_id: string | null;
  featured: boolean;
  stripe_customer_id: string | null;
  subscription_id: string | null;
  active_until: string | null;
}

export interface SupplierMedia {
  id: string;
  created_at: string;
  supplier_id: string;
  type: "photo" | "video" | "certificate" | "document";
  url: string;
  caption: string | null;
  sort_order: number;
  uploaded_at: string;
}

export interface Audit {
  id: string;
  created_at: string;
  supplier_id: string;
  auditor_id: string | null;
  auditor_name: string | null;
  score: number | null;
  report_url: string | null;
  checklist: AuditChecklist | null;
  audit_date: string | null;
  notes: string | null;
}

export interface AuditChecklist {
  items: AuditChecklistItem[];
}

export interface AuditChecklistItem {
  id: string;
  category: string;
  question: string;
  status: "pass" | "fail" | "partial" | "na";
  notes: string | null;
}

export interface Buyer {
  id: string;
  created_at: string;
  user_id: string;
  company: string | null;
  country: string;
  industry: string | null;
  verified_email: boolean;
  full_name: string | null;
  phone: string | null;
}

export interface Inquiry {
  id: string;
  created_at: string;
  buyer_id: string;
  supplier_id: string;
  message: string;
  status: InquiryStatus;
  buyer_response: string | null;
  supplier_response: string | null;
  responded_at: string | null;
  product_interest: string | null;
  estimated_order_value: number | null;
}

export interface Certification {
  id: string;
  created_at: string;
  supplier_id: string;
  type: string;
  issuer: string | null;
  certificate_number: string | null;
  issued_date: string | null;
  expiry_date: string | null;
  doc_url: string | null;
  verified: boolean;
}

export interface Subscription {
  id: string;
  created_at: string;
  supplier_id: string;
  plan: "bronze" | "silver" | "gold";
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface Review {
  id: string;
  created_at: string;
  buyer_id: string;
  supplier_id: string;
  rating: number;
  title: string | null;
  text: string | null;
  order_value: number | null;
  order_currency: string;
  buyer_country: string | null;
  verified_purchase: boolean;
}

export interface Profile {
  id: string;
  created_at: string;
  user_id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
}
