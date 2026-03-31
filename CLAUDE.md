# VerifyIndia — Project Brief for Claude

## What This Project Is

VerifyIndia is a B2B supplier verification platform. Indian manufacturers and suppliers (primarily from Gujarat — Surat, Rajkot, Ahmedabad, Vadodara) pay to get listed with verified physical factory audits. Western buyers (Canada/US) use the platform to find trustworthy suppliers without the risk of fraud or misrepresentation.

**Revenue model:** Supplier subscriptions (Bronze/Silver/Gold) + buyer audit reports ($299) + order commissions.

**Target audience:**
- Suppliers: Gujarat-based manufacturers in textiles, diamonds, metals, chemicals, pharma, plastics, engineering
- Buyers: Canadian and US importers and procurement managers

## Tech Stack

- **Framework:** Next.js 16 with App Router and TypeScript (note: this is Next.js 16, not 14 — APIs may differ from training data)
- **Styling:** Tailwind CSS v4 + custom components in `src/components/`
- **Database:** Supabase (`@supabase/ssr` — NOT `auth-helpers-nextjs`, that package is deprecated)
- **Payments:** Stripe v21 (`stripe` + `@stripe/stripe-js`) — subscriptions + one-time payments
- **Email:** Resend v6
- **AI images:** Google Gemini API (`@google/generative-ai`)
- **Analytics:** PostHog (`posthog-js`)
- **Hosting:** Vercel
- **Forms:** `react-hook-form` + `zod` + `@hookform/resolvers`

## Coding Rules — ALWAYS follow these

- Use TypeScript everywhere. **Never use `any` type.** Define interfaces in `src/types/`.
- Use server components by default. Only add `"use client"` when interactivity is required.
- All database calls go through Supabase server client (`src/lib/supabase/server.ts`) in server components.
- All API routes must verify authentication before processing any data.
- Use Zod for all form validation and API input validation.
- Use `react-hook-form` for all forms.
- Never use inline styles — Tailwind CSS classes only.
- All images use `next/image` component, never bare `<img>` tags.
- File naming: `kebab-case` for files, `PascalCase` for React components.
- Never use `console.log` in production code — use proper error handling with typed errors.
- Never store sensitive data in `localStorage` — use server-side sessions via Supabase.
- Never hardcode API keys — always use `process.env.VARIABLE_NAME`.
- `NEXT_PUBLIC_` prefix = safe to use in browser. Without prefix = server only.

## Folder Structure

```
src/
  app/                      → All pages and API routes (Next.js App Router)
    api/                    → Server-side API endpoints
    (public)/               → Pages visible to everyone (homepage, supplier dir, etc.)
    (auth)/                 → Auth pages (login, signup, onboarding)
    (dashboard)/            → Buyer and supplier dashboards (requires login)
    admin/                  → Admin-only pages (me only)
    layout.tsx              → Root layout with Navbar + Footer
    page.tsx                → Homepage (currently default Next.js — needs building)
    globals.css             → Global styles + Tailwind imports

  components/
    layout/
      Navbar.tsx            → ✅ Built — sticky nav with logo, links, CTA buttons
      Footer.tsx            → ✅ Built — links, tagline, copyright
    suppliers/
      SupplierCard.tsx      → ✅ Built — card with photo, name, city, industry, badge, score
    ui/
      VerificationBadge.tsx → ✅ Built — Bronze/Silver/Gold badge with score display

  lib/
    supabase/
      client.ts             → Browser Supabase client (createBrowserClient from @supabase/ssr)
      server.ts             → Server Supabase client + admin client (createServerClient)
    stripe.ts               → Stripe server instance + STRIPE_PLANS config (Bronze/Silver/Gold)
    utils.ts                → Utility functions (cn, formatters, etc.)

  types/
    database.ts             → TypeScript interfaces for ALL 8 database tables
```

## Stripe Plans (already configured in lib/stripe.ts)

| Plan   | USD/yr | INR/yr | Audits/yr | Key features                          |
|--------|--------|--------|-----------|---------------------------------------|
| Bronze | $95    | ₹8,000 | 1         | Basic listing, 10 photos              |
| Silver | $240   | ₹20,000| 2         | Full profile, analytics, priority     |
| Gold   | $540   | ₹45,000| 4         | Featured, unlimited photos, buyer info|

## Database Tables (Supabase / PostgreSQL)

All types defined in `src/types/database.ts`:

- **suppliers** — id, name, slug, gst_number, city, state, industry, description, verification_score, verified_at, tier (bronze/silver/gold), status (pending_review→audit_scheduled→audit_complete→verified→suspended), min_order_value, lead_time_days, export_countries[], product_categories[], featured, stripe_customer_id, subscription_id, active_until
- **supplier_media** — id, supplier_id, type (photo/video/certificate/document), url, caption, sort_order
- **audits** — id, supplier_id, auditor_id, auditor_name, score, report_url, checklist (jsonb with AuditChecklistItem[]), audit_date, notes
- **buyers** — id, user_id, company, country, industry, verified_email, full_name, phone
- **inquiries** — id, buyer_id, supplier_id, message, status (pending/accepted/declined), buyer_response, supplier_response, product_interest, estimated_order_value
- **certifications** — id, supplier_id, type, issuer, certificate_number, issued_date, expiry_date, doc_url, verified
- **subscriptions** — id, supplier_id, plan (bronze/silver/gold), stripe_subscription_id, stripe_price_id, status (active/canceled/past_due/trialing), current_period_start, current_period_end, cancel_at_period_end
- **reviews** — id, buyer_id, supplier_id, rating, title, text, order_value, order_currency, buyer_country, verified_purchase
- **profiles** — id, user_id (→ auth.users), role (buyer/supplier/admin), full_name, avatar_url, email

## Authentication Roles

- **public:** unauthenticated visitors — can browse the supplier directory
- **buyer:** registered buyers — can send inquiries, purchase audit reports, save suppliers
- **supplier:** registered suppliers — can manage their profile, view analytics
- **admin:** full platform access — me only, managed via Supabase dashboard

## Environment Variables

All secrets in `.env.local`. Never commit this file. It is in `.gitignore`.

```
NEXT_PUBLIC_SUPABASE_URL        → Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   → Supabase anon key (safe for browser)
SUPABASE_SERVICE_ROLE_KEY       → Admin key — server only, never expose

STRIPE_SECRET_KEY               → sk_test_... (use test keys until ready to launch)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY → pk_test_...
STRIPE_WEBHOOK_SECRET           → whsec_... (from Stripe CLI or dashboard)
STRIPE_PRICE_BRONZE             → price_... (create in Stripe dashboard)
STRIPE_PRICE_SILVER             → price_...
STRIPE_PRICE_GOLD               → price_...

RESEND_API_KEY                  → re_...
RESEND_FROM_EMAIL               → noreply@verifyindia.com

GEMINI_API_KEY                  → From aistudio.google.com

NEXT_PUBLIC_POSTHOG_KEY         → phc_... (from app.posthog.com)
NEXT_PUBLIC_POSTHOG_HOST        → https://app.posthog.com

NEXT_PUBLIC_APP_URL             → http://localhost:3000 (change to prod URL on Vercel)
NEXT_PUBLIC_APP_NAME            → VerifyIndia
```

## Design System

- **Primary background:** Dark navy `#0A0F1E`
- **Gold accent:** `#C9A84C`
- **Font:** Geist Sans (already configured in layout.tsx)
- **Supplier tiers:** Bronze = `#CD7F32`, Silver = `#C0C0C0`, Gold = `#FFD700`
- **UI style:** Premium, dark, trust-focused — think Bloomberg or Trustpilot for B2B

## Current Build Status

### Foundation
- [x] Project initialized (Next.js 16 + TypeScript + Tailwind v4)
- [x] All npm packages installed
- [x] Supabase client/server setup (`src/lib/supabase/`)
- [x] Stripe config with Bronze/Silver/Gold plans (`src/lib/stripe.ts`)
- [x] TypeScript database types for all tables (`src/types/database.ts`)
- [x] Auth middleware (`src/middleware.ts`) — protects /dashboard and /admin
- [x] Security headers in `next.config.ts` (HSTS, CSP, X-Frame-Options)
- [x] .env.local file created — **NEEDS REAL API KEYS FILLED IN**
- [ ] Supabase database tables created — run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor

### Components
- [x] Navbar — sticky with dropdown nav and auth buttons
- [x] Footer — full links + Canada/India contact info
- [x] SupplierCard — photo, name, city, badge, score, rating
- [x] VerificationBadge — Bronze/Silver/Gold with optional score
- [x] ScoreRing — SVG circular progress for verification score (1–100)

### Public Pages
- [x] Homepage (`/`) — hero search, industry grid, featured suppliers, how it works, trust section
- [x] Supplier Directory (`/suppliers`) — filterable by city/industry/tier/min-order/export
- [x] Supplier Profile (`/suppliers/[slug]`) — gallery, 25-point audit checklist, certifications, reviews, inquiry + audit report sidebar
- [x] Industry Pages (`/industries/[slug]`) — textiles, diamonds, metals, chemicals, pharmaceuticals, engineering
- [x] How It Works (`/how-it-works`) — 4-step process + 25-point checklist breakdown + tier thresholds
- [x] Pricing (`/pricing`) — 3 supplier plans + 3 buyer audit reports
- [x] Contact (`/contact`) — form with role selector + contact details

### Auth
- [x] Login (`/auth/login`) — email/password + Google OAuth
- [x] Signup (`/auth/signup`) — buyer/supplier role toggle + company field
- [x] Callback (`/auth/callback`) — Supabase OAuth redirect handler

### Dashboards
- [x] Dashboard router (`/dashboard`) — redirects to /buyer or /supplier based on role
- [x] Buyer Dashboard (`/dashboard/buyer`) — stats, quick actions, recent activity
- [x] Supplier Dashboard (`/dashboard/supplier`) — stats, profile completeness, pending actions

### API Routes
- [x] Stripe Checkout (`/api/stripe/create-checkout`) — creates Checkout session for Bronze/Silver/Gold
- [x] Stripe Webhook (`/api/stripe/webhook`) — handles subscription lifecycle
- [x] Stripe Portal (`/api/stripe/portal`) — Customer Portal for billing management
- [x] Image Generation (`/api/generate-image`) — Gemini API + Supabase Storage cache

### Admin
- [x] Verification Queue (`/admin/verifications`) — pipeline view with assign/upload/approve/suspend

### SEO
- [x] Sitemap (`/sitemap.xml`) — auto-generated for all routes
- [x] Robots (`/robots.txt`) — blocks /dashboard, /admin, /api
- [x] JSON-LD structured data on supplier profile pages
- [x] Proper metadata (title, description, OG tags) on all pages

### Next Steps to Go Live
1. Fill in `.env.local` with real Supabase, Stripe, Resend, Gemini keys
2. Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor
3. Create 3 Stripe products (Bronze $95, Silver $240, Gold $540) — add price IDs to `.env.local`
4. Create Supabase Storage buckets: `supplier-media` (public), `audit-reports` (private), `generated-images` (public)
5. Deploy to Vercel: `npx vercel` from this folder
6. Onboard first 20 suppliers manually from your Gujarat network

## DO NOT do these things

- **Never delete existing working code** to add new features — always extend it
- **Never use `any` type** — always define proper TypeScript interfaces
- **Never use `@supabase/auth-helpers-nextjs`** — this project uses `@supabase/ssr`
- **Never use `console.log`** in production code
- **Never store sensitive data in localStorage** — use Supabase server sessions
- **Never skip Zod validation** on API routes
- **Never commit `.env.local`** to git
- **Never use bare `<img>` tags** — always `next/image`
- **Never assume Next.js 14 APIs** — this is Next.js 16, check for breaking changes
