-- ============================================================
-- VerifyIndia — Full Schema Migration v2
-- Reconciled with app code column names.
-- Safe to run: uses IF NOT EXISTS / ON CONFLICT everywhere.
-- Run this entire file in Supabase → SQL Editor → Run
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PHASE 2 — TABLES
-- ============================================================

-- profiles
-- NOTE: app code uses profiles.user_id (not id) to look up users.
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role        TEXT NOT NULL DEFAULT 'buyer'
              CHECK (role IN ('buyer','supplier','admin')),
  full_name   TEXT,
  email       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);

-- suppliers
-- NOTE: app uses verification_status (not status), tier (not verification_tier),
--       active_until (not sub_active_until), subscription_id (not stripe_sub_id).
CREATE TABLE IF NOT EXISTS suppliers (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE,
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  tagline             TEXT,
  description         TEXT,
  city                TEXT NOT NULL DEFAULT 'Surat',
  state               TEXT DEFAULT 'Gujarat',
  country             TEXT DEFAULT 'India',
  industry            TEXT NOT NULL DEFAULT 'other',
  product_categories  TEXT[] DEFAULT '{}',
  gst_number          TEXT,
  established_year    INTEGER,
  employee_count      INTEGER,
  annual_revenue_usd  INTEGER,
  min_order_usd       INTEGER,
  lead_time_days      INTEGER,
  production_volume   TEXT,
  export_capability   BOOLEAN DEFAULT FALSE,
  export_countries    TEXT[] DEFAULT '{}',
  website             TEXT,
  phone               TEXT,
  whatsapp            TEXT,
  email               TEXT,
  -- verification fields (app uses these column names)
  verification_status TEXT DEFAULT 'pending'
    CHECK (verification_status IN (
      'pending','under_review','verified','suspended'
    )),
  tier                TEXT CHECK (tier IN ('bronze','silver','gold')),
  verification_score  INTEGER CHECK (verification_score BETWEEN 0 AND 100),
  verified_at         TIMESTAMPTZ,
  -- subscription / stripe (app uses these column names)
  stripe_customer_id  TEXT,
  subscription_id     TEXT,
  active_until        TIMESTAMPTZ,
  -- meta
  featured            BOOLEAN DEFAULT FALSE,
  view_count          INTEGER DEFAULT 0,
  inquiry_count       INTEGER DEFAULT 0,
  review_count        INTEGER DEFAULT 0,
  avg_rating          NUMERIC(3,2),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  published_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS suppliers_slug_idx       ON suppliers(slug);
CREATE INDEX IF NOT EXISTS suppliers_status_idx     ON suppliers(verification_status);
CREATE INDEX IF NOT EXISTS suppliers_tier_idx       ON suppliers(tier);
CREATE INDEX IF NOT EXISTS suppliers_city_idx       ON suppliers(city);
CREATE INDEX IF NOT EXISTS suppliers_industry_idx   ON suppliers(industry);
CREATE INDEX IF NOT EXISTS suppliers_featured_idx   ON suppliers(featured) WHERE featured = TRUE;

-- full-text search vector (safe: add only if not already there)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suppliers' AND column_name = 'search_vector'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN search_vector tsvector
      GENERATED ALWAYS AS (
        to_tsvector('english',
          COALESCE(name, '') || ' ' ||
          COALESCE(city, '') || ' ' ||
          COALESCE(industry, '') || ' ' ||
          COALESCE(description, '') || ' ' ||
          COALESCE(array_to_string(product_categories, ' '), '')
        )
      ) STORED;
    CREATE INDEX suppliers_search_idx ON suppliers USING gin(search_vector);
  END IF;
END;
$$;

-- supplier_media
CREATE TABLE IF NOT EXISTS supplier_media (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('photo','video','certificate','document')),
  url         TEXT NOT NULL,
  caption     TEXT,
  is_primary  BOOLEAN DEFAULT FALSE,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS supplier_media_supplier_idx ON supplier_media(supplier_id);

-- certifications
CREATE TABLE IF NOT EXISTS certifications (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL,
  issuer      TEXT NOT NULL,
  cert_number TEXT,
  issued_at   DATE,
  expires_at  DATE,
  doc_url     TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS certifications_supplier_idx ON certifications(supplier_id);

-- audits (app writes auditor_user_id and checklist jsonb)
CREATE TABLE IF NOT EXISTS audits (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_id     UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  auditor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  auditor_name    TEXT,
  score           INTEGER CHECK (score BETWEEN 0 AND 100),
  tier            TEXT CHECK (tier IN ('bronze','silver','gold')),
  checklist       JSONB DEFAULT '[]',
  report_url      TEXT,
  notes           TEXT,
  is_public       BOOLEAN DEFAULT FALSE,
  audited_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audits_supplier_idx ON audits(supplier_id);

-- buyers (app uses buyers.user_id to look up)
CREATE TABLE IF NOT EXISTS buyers (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company       TEXT,
  country       TEXT NOT NULL DEFAULT 'CA',
  industry      TEXT,
  full_name     TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS buyers_user_id_idx ON buyers(user_id);

-- inquiries (buyer_id → buyers.id, subject and response added)
CREATE TABLE IF NOT EXISTS inquiries (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id     UUID REFERENCES buyers(id) ON DELETE CASCADE NOT NULL,
  supplier_id  UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  subject      TEXT NOT NULL DEFAULT 'Inquiry',
  message      TEXT NOT NULL,
  budget_range TEXT,
  timeline     TEXT,
  status       TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','declined','completed')),
  response     TEXT,
  responded_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_buyer_idx    ON inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS inquiries_supplier_idx ON inquiries(supplier_id);
CREATE INDEX IF NOT EXISTS inquiries_status_idx   ON inquiries(status);

-- reviews
CREATE TABLE IF NOT EXISTS reviews (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id         UUID REFERENCES buyers(id) ON DELETE CASCADE NOT NULL,
  supplier_id      UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  inquiry_id       UUID REFERENCES inquiries(id),
  rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title            TEXT,
  body             TEXT NOT NULL,
  order_value      INTEGER,
  buyer_company    TEXT,
  buyer_country    TEXT,
  is_verified      BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_id, supplier_id)
);

CREATE INDEX IF NOT EXISTS reviews_supplier_idx ON reviews(supplier_id);

-- saved_suppliers (buyer_id → buyers.id)
CREATE TABLE IF NOT EXISTS saved_suppliers (
  buyer_id    UUID REFERENCES buyers(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  saved_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (buyer_id, supplier_id)
);

CREATE INDEX IF NOT EXISTS saved_suppliers_buyer_idx ON saved_suppliers(buyer_id);

-- subscriptions (Stripe subscription records)
CREATE TABLE IF NOT EXISTS subscriptions (
  id                     UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_id            UUID NOT NULL,
  plan                   TEXT NOT NULL CHECK (plan IN ('bronze','silver','gold')),
  stripe_subscription_id TEXT,
  stripe_price_id        TEXT,
  status                 TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','canceled','past_due','trialing')),
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_supplier_idx ON subscriptions(supplier_id);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_sub_idx
  ON subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- audit_log
CREATE TABLE IF NOT EXISTS audit_log (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id   UUID REFERENCES auth.users(id),
  action     TEXT NOT NULL,
  target_id  UUID,
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PHASE 3 — ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits         ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log      ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "profiles_select_own"  ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON profiles;
CREATE POLICY "profiles_select_own"  ON profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "profiles_update_own"  ON profiles FOR UPDATE USING (user_id = auth.uid());

-- suppliers
DROP POLICY IF EXISTS "suppliers_select_verified" ON suppliers;
DROP POLICY IF EXISTS "suppliers_insert_own"      ON suppliers;
DROP POLICY IF EXISTS "suppliers_update_own"      ON suppliers;
CREATE POLICY "suppliers_select_verified" ON suppliers
  FOR SELECT USING (
    verification_status = 'verified'
    OR user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "suppliers_insert_own" ON suppliers
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "suppliers_update_own" ON suppliers
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- supplier_media
DROP POLICY IF EXISTS "media_public_read"    ON supplier_media;
DROP POLICY IF EXISTS "media_supplier_write" ON supplier_media;
DROP POLICY IF EXISTS "media_supplier_delete" ON supplier_media;
CREATE POLICY "media_public_read" ON supplier_media FOR SELECT USING (true);
CREATE POLICY "media_supplier_write" ON supplier_media
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND user_id = auth.uid())
  );
CREATE POLICY "media_supplier_delete" ON supplier_media
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND user_id = auth.uid())
  );

-- certifications
DROP POLICY IF EXISTS "certs_public_read"    ON certifications;
DROP POLICY IF EXISTS "certs_supplier_write" ON certifications;
CREATE POLICY "certs_public_read" ON certifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND verification_status = 'verified')
  OR EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND user_id = auth.uid())
);
CREATE POLICY "certs_supplier_write" ON certifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND user_id = auth.uid())
  );

-- audits
DROP POLICY IF EXISTS "audits_admin"          ON audits;
DROP POLICY IF EXISTS "audits_supplier_own"   ON audits;
CREATE POLICY "audits_admin" ON audits
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "audits_supplier_own" ON audits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND user_id = auth.uid())
  );

-- buyers
DROP POLICY IF EXISTS "buyers_select_own"  ON buyers;
DROP POLICY IF EXISTS "buyers_insert_own"  ON buyers;
DROP POLICY IF EXISTS "buyers_update_own"  ON buyers;
CREATE POLICY "buyers_select_own"  ON buyers FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "buyers_insert_own"  ON buyers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "buyers_update_own"  ON buyers FOR UPDATE USING (user_id = auth.uid());

-- inquiries
DROP POLICY IF EXISTS "inquiries_buyer_all"      ON inquiries;
DROP POLICY IF EXISTS "inquiries_supplier_read"  ON inquiries;
DROP POLICY IF EXISTS "inquiries_supplier_update" ON inquiries;
CREATE POLICY "inquiries_buyer_all" ON inquiries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM buyers WHERE id = buyer_id AND user_id = auth.uid())
  );
CREATE POLICY "inquiries_supplier_read" ON inquiries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND user_id = auth.uid())
  );
CREATE POLICY "inquiries_supplier_update" ON inquiries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND user_id = auth.uid())
  );

-- reviews
DROP POLICY IF EXISTS "reviews_public_read"  ON reviews;
DROP POLICY IF EXISTS "reviews_buyer_insert" ON reviews;
CREATE POLICY "reviews_public_read"  ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_buyer_insert" ON reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM buyers WHERE id = buyer_id AND user_id = auth.uid())
  );

-- saved_suppliers
DROP POLICY IF EXISTS "saved_buyer_all" ON saved_suppliers;
CREATE POLICY "saved_buyer_all" ON saved_suppliers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM buyers WHERE id = buyer_id AND user_id = auth.uid())
  );

-- subscriptions
DROP POLICY IF EXISTS "subscriptions_own" ON subscriptions;
CREATE POLICY "subscriptions_own" ON subscriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM suppliers WHERE id = supplier_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- audit_log
DROP POLICY IF EXISTS "audit_log_admin" ON audit_log;
CREATE POLICY "audit_log_admin" ON audit_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- PHASE 4 — AUTO-CREATE PROFILE TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_role text := LOWER(TRIM(COALESCE(NEW.raw_user_meta_data->>'role', '')));
  safe_role text;
  disp_name text;
BEGIN
  IF raw_role IN ('buyer', 'supplier', 'admin') THEN
    safe_role := raw_role;
  ELSE
    safe_role := 'buyer';
  END IF;

  disp_name := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), '');
  IF disp_name IS NULL THEN
    disp_name := split_part(COALESCE(NEW.email, ''), '@', 1);
  END IF;
  IF disp_name = '' THEN
    disp_name := 'User';
  END IF;

  INSERT INTO profiles (user_id, role, full_name, email)
  VALUES (NEW.id, safe_role, disp_name, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- PHASE 5 — STORAGE BUCKET
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'supplier-media',
  'supplier-media',
  true,
  10485760,  -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "supplier_media_public_read" ON storage.objects;
CREATE POLICY "supplier_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'supplier-media');

DROP POLICY IF EXISTS "supplier_media_auth_upload" ON storage.objects;
CREATE POLICY "supplier_media_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'supplier-media'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "supplier_media_auth_delete" ON storage.objects;
CREATE POLICY "supplier_media_auth_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'supplier-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- PHASE 6 — SEED 6 VERIFIED SUPPLIERS
-- ============================================================

INSERT INTO suppliers (
  user_id, slug, name, tagline, description,
  city, state, country, industry, product_categories,
  verification_status, tier, verification_score,
  verified_at, published_at,
  min_order_usd, lead_time_days, employee_count,
  export_capability, export_countries,
  gst_number, phone, email, website,
  view_count, inquiry_count, review_count, avg_rating
) VALUES

(NULL,'shree-textile-mills','Shree Textile Mills',
 'Premium synthetic fabrics from India''s textile capital',
 'Shree Textile Mills is a leading manufacturer of premium synthetic fabrics based in Surat. Established in 1985 with 38 years of experience. Our 25,000 sq ft facility employs 120 workers producing 50,000+ meters monthly. ISO 9001:2015 and OEKO-TEX certified.',
 'Surat','Gujarat','India','textiles',
 ARRAY['Synthetic Fabrics','Sarees','Dress Material','Georgette','Chiffon'],
 'verified','gold',92,
 NOW(), NOW(),
 500, 21, 120, TRUE,
 ARRAY['USA','Canada','UK','Germany','Australia'],
 '24AABCS1429B1ZC','+91 9825001234','exports@shreetextilemills.com','https://shreetextilemills.com',
 340,28,18,4.8),

(NULL,'rajkot-precision-engineering','Rajkot Precision Engineering',
 'CNC components and castings for global OEMs',
 'Rajkot Precision Engineering specializes in high-tolerance CNC machined components and castings for international OEMs. 200+ CNC machines, ISO 9001:2015 certified. 45,000 sq ft facility serving buyers from 12 countries since 1998.',
 'Rajkot','Gujarat','India','metals',
 ARRAY['CNC Components','Castings','Auto Parts','Forgings'],
 'verified','gold',88,
 NOW(), NOW(),
 1000, 28, 85, TRUE,
 ARRAY['USA','Germany','UK','Japan','Canada'],
 '24AABCR2318B1ZD','+91 9825005678','exports@rajkotprecision.com','https://rajkotprecision.com',
 280,22,12,4.9),

(NULL,'vadodara-pharma-labs','Vadodara Pharma Labs',
 'WHO-GMP certified API and generic drug manufacturer',
 'WHO-GMP certified manufacturer of active pharmaceutical ingredients and generic formulations. R&D team of 45 scientists. US FDA approved facilities. DMFs for 12 APIs. Established 2003 with 200+ employees across two manufacturing sites.',
 'Vadodara','Gujarat','India','pharmaceuticals',
 ARRAY['API Ingredients','Generic Drugs','Nutraceuticals','Intermediates'],
 'verified','gold',95,
 NOW(), NOW(),
 5000, 45, 200, TRUE,
 ARRAY['USA','UK','Germany','Australia','Canada','UAE'],
 '24AABCV3412C1ZE','+91 9825009012','exports@vadodara-pharma.com','https://vadodara-pharma.com',
 420,35,22,4.9),

(NULL,'diamond-star-exports','Diamond Star Exports',
 'Certified diamonds and precious gems from Surat',
 'KYC-compliant manufacturer and exporter of certified natural and lab-grown diamonds. Kimberley Process certified. GIA/IGI certified stones. 25 years in the industry supplying jewelry brands in 18 countries.',
 'Surat','Gujarat','India','diamonds',
 ARRAY['Brilliant Cut','Princess Cut','Loose Diamonds','Lab Grown'],
 'verified','silver',79,
 NOW(), NOW(),
 2000, 14, 45, TRUE,
 ARRAY['USA','Belgium','Israel','Hong Kong','UK'],
 '24AABCD4521D1ZF','+91 9825003456','exports@diamondstar.in','https://diamondstar.in',
 195,15,7,4.6),

(NULL,'ahmedabad-chem-industries','Ahmedabad Chem Industries',
 'Specialty chemicals and surfactants for industrial buyers',
 'Manufacturer of specialty chemicals, surfactants, and dyes for textile, paint, and FMCG industries. REACH compliant for EU export. ISO 14001 certified. 30,000 MT annual production capacity. Supplying 15 countries since 2001.',
 'Ahmedabad','Gujarat','India','chemicals',
 ARRAY['Specialty Chemicals','Surfactants','Dyes & Pigments','Intermediates'],
 'verified','silver',74,
 NOW(), NOW(),
 2000, 30, 65, TRUE,
 ARRAY['USA','Germany','Netherlands','Turkey','Brazil'],
 '24AABCA5634E1ZG','+91 9825007890','exports@ahmedabadchem.com','https://ahmedabadchem.com',
 165,12,5,4.3),

(NULL,'morbi-ceramic-world','Morbi Ceramic World',
 'Floor and wall tiles from India''s ceramic capital',
 'Premium floor tiles, wall tiles, and vitrified tiles from Morbi which supplies 70% of India''s ceramic output. ISO 9001 certified, BIS marked, CE certified for EU. Digital printing technology for custom designs. Exporting since 2008.',
 'Morbi','Gujarat','India','ceramics',
 ARRAY['Floor Tiles','Wall Tiles','Vitrified Tiles','Digital Tiles'],
 'verified','bronze',61,
 NOW(), NOW(),
 3000, 35, 40, TRUE,
 ARRAY['UAE','Saudi Arabia','UK','USA'],
 '24AABCM6745F1ZH','+91 9825001122','exports@morbiceramic.com','https://morbiceramic.com',
 120,8,9,4.1)

ON CONFLICT (slug) DO UPDATE SET
  verification_status = EXCLUDED.verification_status,
  tier                = EXCLUDED.tier,
  verification_score  = EXCLUDED.verification_score,
  verified_at         = EXCLUDED.verified_at,
  published_at        = EXCLUDED.published_at,
  view_count          = EXCLUDED.view_count,
  inquiry_count       = EXCLUDED.inquiry_count,
  review_count        = EXCLUDED.review_count,
  avg_rating          = EXCLUDED.avg_rating;

-- ============================================================
-- PHASE 7 — CERTIFICATIONS FOR SEED SUPPLIERS
-- ============================================================

-- ISO 9001 for Shree Textile Mills
INSERT INTO certifications (supplier_id, type, issuer, is_verified, expires_at)
SELECT id, 'ISO 9001:2015', 'Bureau Veritas', true, '2027-01-01'::date
FROM suppliers WHERE slug = 'shree-textile-mills'
ON CONFLICT DO NOTHING;

-- GST Verified for all 6 suppliers
INSERT INTO certifications (supplier_id, type, issuer, is_verified)
SELECT id, 'GST Verified', 'Government of India', true
FROM suppliers WHERE slug IN (
  'shree-textile-mills','rajkot-precision-engineering',
  'vadodara-pharma-labs','diamond-star-exports',
  'ahmedabad-chem-industries','morbi-ceramic-world'
)
ON CONFLICT DO NOTHING;

-- WHO-GMP for pharma
INSERT INTO certifications (supplier_id, type, issuer, is_verified, expires_at)
SELECT id, 'WHO-GMP', 'World Health Organization', true, '2026-12-01'::date
FROM suppliers WHERE slug = 'vadodara-pharma-labs'
ON CONFLICT DO NOTHING;

-- Kimberley Process for diamonds
INSERT INTO certifications (supplier_id, type, issuer, is_verified)
SELECT id, 'Kimberley Process', 'KPCS', true
FROM suppliers WHERE slug = 'diamond-star-exports'
ON CONFLICT DO NOTHING;

-- OEKO-TEX for textiles
INSERT INTO certifications (supplier_id, type, issuer, is_verified, expires_at)
SELECT id, 'OEKO-TEX Standard 100', 'Intertek', true, '2026-06-01'::date
FROM suppliers WHERE slug = 'shree-textile-mills'
ON CONFLICT DO NOTHING;

-- ISO 14001 for chemicals
INSERT INTO certifications (supplier_id, type, issuer, is_verified, expires_at)
SELECT id, 'ISO 14001:2015', 'SGS', true, '2027-03-01'::date
FROM suppliers WHERE slug = 'ahmedabad-chem-industries'
ON CONFLICT DO NOTHING;

-- ISO 9001 for precision engineering
INSERT INTO certifications (supplier_id, type, issuer, is_verified, expires_at)
SELECT id, 'ISO 9001:2015', 'TÜV Rheinland', true, '2027-05-01'::date
FROM suppliers WHERE slug = 'rajkot-precision-engineering'
ON CONFLICT DO NOTHING;

-- ============================================================
-- PHASE 8 — SKIP REVIEWS (buyer_id FK requires a real buyer)
-- reviews need a real buyer row. Create a test buyer account
-- in Supabase Auth first, then run:
--
-- INSERT INTO buyers (user_id, company, country, full_name)
-- VALUES ('[test-user-uuid]', 'Test Buyer Co', 'US', 'Test Buyer');
--
-- Then insert reviews with that buyer's buyers.id as buyer_id.
-- ============================================================

-- ============================================================
-- PHASE 9 — MAKE MOST RECENT USER AN ADMIN
-- ============================================================

-- Show most recent 5 users (check output to confirm which is yours)
-- Then update the correct one:
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Gets the most recently created auth user
  SELECT id INTO v_user_id
  FROM auth.users
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Create profile if it doesn't exist
    INSERT INTO profiles (user_id, email, full_name, role)
    SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), 'admin'
    FROM auth.users WHERE id = v_user_id
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

    RAISE NOTICE 'Set user % to admin', v_user_id;
  ELSE
    RAISE NOTICE 'No users found yet. Sign up first, then rerun this block.';
  END IF;
END;
$$;

-- ============================================================
-- PHASE 10 — VERIFICATION CHECKS
-- ============================================================

SELECT 'tables'             AS check_type, COUNT(*)::text AS result
FROM information_schema.tables WHERE table_schema = 'public'
UNION ALL
SELECT 'suppliers',          COUNT(*)::text FROM suppliers
UNION ALL
SELECT 'verified_suppliers', COUNT(*)::text FROM suppliers WHERE verification_status = 'verified'
UNION ALL
SELECT 'certifications',     COUNT(*)::text FROM certifications
UNION ALL
SELECT 'admin_users',        COUNT(*)::text FROM profiles WHERE role = 'admin'
UNION ALL
SELECT 'storage_buckets',    COUNT(*)::text FROM storage.buckets WHERE id = 'supplier-media';
