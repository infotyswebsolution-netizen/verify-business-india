-- VerifyIndia Database Schema
-- Run this in your Supabase SQL Editor to set up all tables with RLS

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null default 'buyer' check (role in ('buyer', 'supplier', 'admin')),
  full_name text,
  avatar_url text,
  email text not null,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (user_id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- SUPPLIERS TABLE
-- ============================================================
create table suppliers (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  gst_number text,
  city text not null,
  state text not null default 'Gujarat',
  industry text not null,
  description text,
  verification_score integer check (verification_score between 0 and 100),
  verified_at timestamptz,
  tier text check (tier in ('bronze', 'silver', 'gold')),
  status text not null default 'pending_review'
    check (status in ('pending_review', 'audit_scheduled', 'audit_complete', 'verified', 'suspended')),
  min_order_value numeric,
  min_order_currency text default 'USD',
  lead_time_days integer,
  production_volume text,
  export_capability boolean default false,
  export_countries text[] default '{}',
  product_categories text[] default '{}',
  website text,
  whatsapp text,
  email text,
  phone text,
  featured boolean default false,
  stripe_customer_id text,
  subscription_id text,
  active_until timestamptz
);

create index on suppliers(slug);
create index on suppliers(status);
create index on suppliers(tier);
create index on suppliers(city);
create index on suppliers(industry);
create index on suppliers(featured) where featured = true;

-- Full-text search
alter table suppliers
  add column search_vector tsvector
  generated always as (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(city, '') || ' ' ||
      coalesce(industry, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(array_to_string(product_categories, ' '), '')
    )
  ) stored;

create index on suppliers using gin(search_vector);

-- ============================================================
-- SUPPLIER MEDIA
-- ============================================================
create table supplier_media (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  supplier_id uuid references suppliers(id) on delete cascade not null,
  type text not null check (type in ('photo', 'video', 'certificate', 'document')),
  url text not null,
  caption text,
  sort_order integer default 0,
  uploaded_at timestamptz default now()
);

create index on supplier_media(supplier_id);

-- ============================================================
-- AUDITS TABLE
-- ============================================================
create table audits (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  supplier_id uuid references suppliers(id) on delete cascade not null,
  auditor_id uuid references auth.users(id) on delete set null,
  auditor_name text,
  score integer check (score between 0 and 100),
  report_url text,
  checklist jsonb,
  audit_date date,
  notes text
);

create index on audits(supplier_id);

-- ============================================================
-- BUYERS TABLE
-- ============================================================
create table buyers (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  company text,
  country text not null default 'CA',
  industry text,
  verified_email boolean default false,
  full_name text,
  phone text
);

-- ============================================================
-- INQUIRIES TABLE
-- ============================================================
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  buyer_id uuid references buyers(id) on delete cascade not null,
  supplier_id uuid references suppliers(id) on delete cascade not null,
  message text not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  buyer_response text,
  supplier_response text,
  responded_at timestamptz,
  product_interest text,
  estimated_order_value numeric
);

create index on inquiries(buyer_id);
create index on inquiries(supplier_id);
create index on inquiries(status);

-- ============================================================
-- CERTIFICATIONS TABLE
-- ============================================================
create table certifications (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  supplier_id uuid references suppliers(id) on delete cascade not null,
  type text not null,
  issuer text,
  certificate_number text,
  issued_date date,
  expiry_date date,
  doc_url text,
  verified boolean default false
);

create index on certifications(supplier_id);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  supplier_id uuid not null,
  plan text not null check (plan in ('bronze', 'silver', 'gold')),
  stripe_subscription_id text,
  stripe_price_id text,
  status text not null default 'active'
    check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false
);

create index on subscriptions(supplier_id);
create unique index on subscriptions(stripe_subscription_id) where stripe_subscription_id is not null;

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  buyer_id uuid references buyers(id) on delete cascade not null,
  supplier_id uuid references suppliers(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  text text,
  order_value numeric,
  order_currency text default 'USD',
  buyer_country text,
  verified_purchase boolean default false,
  unique(buyer_id, supplier_id)
);

create index on reviews(supplier_id);

-- ============================================================
-- SAVED SUPPLIERS TABLE
-- ============================================================
create table saved_suppliers (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  buyer_id uuid references buyers(id) on delete cascade not null,
  supplier_id uuid references suppliers(id) on delete cascade not null,
  unique(buyer_id, supplier_id)
);

create index on saved_suppliers(buyer_id);

-- ============================================================
-- AUDIT LOGS TABLE (admin action tracking)
-- ============================================================
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb,
  ip_address text
);

-- No delete permission on audit_logs
create policy "audit_logs_insert_admin" on audit_logs
  for insert with check (
    exists(select 1 from profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "audit_logs_select_admin" on audit_logs
  for select using (
    exists(select 1 from profiles where user_id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

alter table profiles enable row level security;
alter table suppliers enable row level security;
alter table supplier_media enable row level security;
alter table audits enable row level security;
alter table buyers enable row level security;
alter table inquiries enable row level security;
alter table certifications enable row level security;
alter table subscriptions enable row level security;
alter table reviews enable row level security;
alter table saved_suppliers enable row level security;
alter table audit_logs enable row level security;

-- PROFILES
create policy "profiles_select_own" on profiles
  for select using (user_id = auth.uid());
create policy "profiles_update_own" on profiles
  for update using (user_id = auth.uid());

-- SUPPLIERS — public read for verified, suppliers manage own
create policy "suppliers_select_verified" on suppliers
  for select using (status = 'verified' or user_id = auth.uid() or
    exists(select 1 from profiles where user_id = auth.uid() and role = 'admin'));
create policy "suppliers_insert_own" on suppliers
  for insert with check (user_id = auth.uid());
create policy "suppliers_update_own" on suppliers
  for update using (user_id = auth.uid() or
    exists(select 1 from profiles where user_id = auth.uid() and role = 'admin'));

-- SUPPLIER MEDIA — public read, supplier manages own
create policy "supplier_media_select" on supplier_media
  for select using (
    exists(select 1 from suppliers where id = supplier_id and (status = 'verified' or user_id = auth.uid()))
  );
create policy "supplier_media_insert" on supplier_media
  for insert with check (
    exists(select 1 from suppliers where id = supplier_id and user_id = auth.uid())
  );
create policy "supplier_media_delete" on supplier_media
  for delete using (
    exists(select 1 from suppliers where id = supplier_id and user_id = auth.uid())
  );

-- AUDITS — suppliers see own, admins see all, buyers see purchased reports
create policy "audits_select_own_supplier" on audits
  for select using (
    exists(select 1 from suppliers where id = supplier_id and user_id = auth.uid())
    or exists(select 1 from profiles where user_id = auth.uid() and role = 'admin')
  );
create policy "audits_manage_admin" on audits
  for all using (
    exists(select 1 from profiles where user_id = auth.uid() and role = 'admin')
  );

-- BUYERS — manage own profile
create policy "buyers_select_own" on buyers
  for select using (user_id = auth.uid() or
    exists(select 1 from profiles where user_id = auth.uid() and role = 'admin'));
create policy "buyers_insert_own" on buyers
  for insert with check (user_id = auth.uid());
create policy "buyers_update_own" on buyers
  for update using (user_id = auth.uid());

-- INQUIRIES — buyers see own, suppliers see received (Gold sees buyer details)
create policy "inquiries_buyer_own" on inquiries
  for all using (
    exists(select 1 from buyers where id = buyer_id and user_id = auth.uid())
  );
create policy "inquiries_supplier_received" on inquiries
  for select using (
    exists(select 1 from suppliers where id = supplier_id and user_id = auth.uid())
  );
create policy "inquiries_supplier_respond" on inquiries
  for update using (
    exists(select 1 from suppliers where id = supplier_id and user_id = auth.uid())
  );

-- CERTIFICATIONS — public read, supplier manages own
create policy "certifications_select" on certifications
  for select using (
    exists(select 1 from suppliers where id = supplier_id and status = 'verified')
    or exists(select 1 from suppliers where id = supplier_id and user_id = auth.uid())
  );
create policy "certifications_manage_own" on certifications
  for all using (
    exists(select 1 from suppliers where id = supplier_id and user_id = auth.uid())
  );

-- SUBSCRIPTIONS — supplier sees own, admin sees all
create policy "subscriptions_own" on subscriptions
  for select using (
    supplier_id = auth.uid() or
    exists(select 1 from profiles where user_id = auth.uid() and role = 'admin')
  );

-- REVIEWS — public read, verified buyers can post
create policy "reviews_select_public" on reviews
  for select using (true);
create policy "reviews_insert_buyer" on reviews
  for insert with check (
    exists(select 1 from buyers where id = buyer_id and user_id = auth.uid())
  );

-- SAVED SUPPLIERS — buyers manage their own saves
create policy "saved_suppliers_own_select" on saved_suppliers
  for select using (
    exists(select 1 from buyers where id = buyer_id and user_id = auth.uid())
  );
create policy "saved_suppliers_own_insert" on saved_suppliers
  for insert with check (
    exists(select 1 from buyers where id = buyer_id and user_id = auth.uid())
  );
create policy "saved_suppliers_own_delete" on saved_suppliers
  for delete using (
    exists(select 1 from buyers where id = buyer_id and user_id = auth.uid())
  );

-- ============================================================
-- STORAGE BUCKETS (run separately in Supabase Dashboard)
-- ============================================================
-- Create these buckets in Supabase Storage:
-- 1. "supplier-media" — public, 10MB max
-- 2. "audit-reports" — private, 25MB max
-- 3. "generated-images" — public, 5MB max
-- 4. "certifications" — private, 10MB max
