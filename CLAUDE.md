# VerifyIndia — Project Brief for Claude

> This file is read by Claude Code automatically every time you start a session.
> It tells Claude exactly what this project is, how it works, and how to help.

---

## What is this project?

VerifyIndia is a B2B supplier verification platform. Western buyers (Canada, US, UK) want to source products from Gujarat, India but cannot trust random listings on IndiaMART or Alibaba. We solve this by physically auditing every supplier before they appear on the platform.

**The business model:**
- Suppliers pay ₹8,000–₹45,000/year to be listed (Bronze/Silver/Gold tiers)
- Buyers pay $299–$999 for detailed audit reports
- We take 2–5% commission on facilitated orders

**The competitive advantage:**
- Physical factory audits by our India-based field agent
- GST and legal verification
- 25-point standardized checklist
- Canadian company registration gives international credibility

---

## Tech Stack

- **Framework:** Next.js 16 with App Router and TypeScript (note: Next.js 16 — APIs may differ from training data)
- **Styling:** Tailwind CSS v4 + custom components in `src/components/`
- **Database:** Supabase (`@supabase/ssr` — NOT `auth-helpers-nextjs`, that package is deprecated)
- **Payments:** Stripe v21 — subscriptions + one-time payments. Use `getStripe()` not `stripe` directly.
- **Email:** Resend v6
- **AI images:** Google Gemini API (`@google/generative-ai`)
- **Hosting:** Vercel (auto-deploys on every `git push` to main)

---

## Project Structure

```
verifyindia/
├── src/
│   ├── app/                    Next.js App Router pages
│   │   ├── api/                API routes (stripe, generate-image)
│   │   ├── auth/               Login, signup, callback
│   │   ├── dashboard/          Protected: buyer + supplier dashboards
│   │   ├── admin/              Protected: admin only
│   │   ├── suppliers/          Directory + [slug] profile pages
│   │   ├── industries/[slug]   Industry landing pages
│   │   ├── how-it-works/       Verification process explainer
│   │   ├── pricing/            Supplier plans + buyer report pricing
│   │   ├── contact/            Contact form
│   │   └── page.tsx            Homepage
│   ├── components/
│   │   ├── layout/             Navbar.tsx, Footer.tsx
│   │   ├── suppliers/          SupplierCard.tsx
│   │   └── ui/                 VerificationBadge.tsx, ScoreRing
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       Browser client (for "use client" components)
│   │   │   └── server.ts       Server client (for RSC and API routes)
│   │   ├── stripe.ts           Stripe — use getStripe() not stripe directly
│   │   └── utils.ts            cn(), slugify(), formatCurrency() etc
│   ├── types/
│   │   └── database.ts         All Supabase table TypeScript interfaces
│   └── middleware.ts            Route protection (/dashboard, /admin)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   Full DB schema — run in Supabase SQL Editor
├── .cursorrules                Cursor AI rules (read automatically)
├── .env.local                  All secrets (never read or print values)
└── CLAUDE.md                   This file
```

---

## Environment Variables

**Never print these values. Never include them in code suggestions.**

| Variable | Purpose |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase public key (safe for browser) |
| SUPABASE_SERVICE_ROLE_KEY | Supabase admin key (server only, bypasses RLS) |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe frontend key |
| STRIPE_SECRET_KEY | Stripe backend key |
| STRIPE_WEBHOOK_SECRET | Stripe webhook verification |
| STRIPE_PRICE_BRONZE | Stripe price ID for Bronze plan |
| STRIPE_PRICE_SILVER | Stripe price ID for Silver plan |
| STRIPE_PRICE_GOLD | Stripe price ID for Gold plan |
| GEMINI_API_KEY | Google Gemini for image generation |
| RESEND_API_KEY | Resend for transactional email |
| RESEND_FROM_EMAIL | info.tyswebsolution@gmail.com |
| NEXT_PUBLIC_APP_URL | App URL (localhost:3000 dev, domain in prod) |
| NEXT_PUBLIC_APP_NAME | VerifyIndia |

---

## Database Schema — Quick Reference

### suppliers table (most important)
```sql
id                  UUID (primary key)
user_id             UUID → auth.users
slug                TEXT (unique, used in URLs: /suppliers/[slug])
name                TEXT
city                TEXT (Surat, Rajkot, Ahmedabad, Vadodara etc)
industry            TEXT (textiles, metals, diamonds, chemicals etc)
status              TEXT → 'pending_review' | 'audit_scheduled' | 'audit_complete' | 'verified' | 'suspended'
tier                TEXT → 'bronze' | 'silver' | 'gold' | NULL
verification_score  INTEGER 0-100
export_capability   BOOLEAN
product_categories  TEXT[]
stripe_customer_id  TEXT
subscription_id     TEXT
active_until        TIMESTAMPTZ
```

### Key relationships
- profiles.user_id = auth.users.id (one profile per auth user)
- suppliers.user_id = auth.users.id (one supplier profile per user)
- buyers.user_id = auth.users.id (one buyer profile per user)
- inquiries: buyer_id + supplier_id
- reviews: unique(buyer_id, supplier_id) — one review per pair

### Row Level Security
- suppliers: public can SELECT where status = 'verified'
- inquiries: buyer sees own rows, supplier sees rows where supplier_id matches
- reviews: public SELECT, buyer manages own rows
- All writes require authenticated user

---

## Common Tasks — How to Do Them

### Fetch a supplier by slug (server component)
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: supplier } = await supabase
  .from('suppliers')
  .select(`*, supplier_media(*), certifications(*), reviews(*), audits(*)`)
  .eq('slug', slug)
  .eq('status', 'verified')
  .single()
```

### Get current user's role
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('user_id', user.id)
  .single()
// profile.role → 'buyer' | 'supplier' | 'admin'
```

### Search suppliers with filters
```typescript
let query = supabase
  .from('suppliers')
  .select('*')
  .eq('status', 'verified')

if (search) query = query.textSearch('search_vector', search)
if (city) query = query.eq('city', city)
if (industry) query = query.eq('industry', industry)
if (tier) query = query.eq('tier', tier)

const { data } = await query.order('verification_score', { ascending: false })
```

### Send an email with Resend
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: recipientEmail,
  subject: 'New inquiry received',
  html: `<p>You have a new inquiry from ${buyerName}</p>`
})
```

### Use Stripe (always getStripe, never stripe directly)
```typescript
import { getStripe } from '@/lib/stripe'

const stripe = getStripe()  // throws clear error if key missing
const session = await stripe.checkout.sessions.create({ ... })
```

### Generate image with Gemini
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
```

---

## Frequent Mistakes to Avoid

| Wrong | Right |
|---|---|
| `import { createClient } from '@supabase/supabase-js'` | `import { createClient } from '@/lib/supabase/server'` |
| `import { stripe } from '@/lib/stripe'` | `import { getStripe } from '@/lib/stripe'` |
| `<img src={url}>` | `<Image src={url} width={} height={} alt={} />` |
| `style={{ color: 'red' }}` | `className="text-red-500"` |
| `fetch('/api/...')` in Server Component | Use Supabase directly in Server Component |
| `process.env.NEXT_PUBLIC_X` in API route | Just `process.env.X` (no NEXT_PUBLIC needed server-side) |
| Hardcoding supplier IDs | Always use slugs in URLs, IDs internally |
| `const { data } = supabase.from(...)` | Always await: `const { data } = await supabase.from(...)` |
| Using `@supabase/auth-helpers-nextjs` | This project uses `@supabase/ssr` only |
| Assuming Next.js 14 APIs | This is Next.js 16 — check for breaking changes |

---

## What's Already Built (check before creating anything)

Before suggesting to "create" a file, check if it already exists:

### ✅ Pages built
- `/` — Homepage (hero, search, industry grid, featured suppliers, how it works)
- `/suppliers` — Directory with city/industry/tier/export filters
- `/suppliers/[slug]` — Full profile: gallery, 25-point checklist, certifications, reviews, inquiry sidebar
- `/industries/[slug]` — 6 industry pages (textiles, diamonds, metals, chemicals, pharma, engineering)
- `/how-it-works` — Full audit process + tier thresholds
- `/pricing` — 3 supplier plans + 3 buyer audit reports
- `/contact` — Contact form
- `/auth/login` — Email + Google OAuth
- `/auth/signup` — Buyer/supplier role toggle
- `/dashboard/buyer` — Stats, quick actions, recent activity
- `/dashboard/supplier` — Stats, profile completeness, pending actions
- `/admin/verifications` — Verification pipeline queue

### ✅ API routes built
- `/api/stripe/create-checkout` — Stripe Checkout for plans
- `/api/stripe/webhook` — Subscription lifecycle
- `/api/stripe/portal` — Billing management
- `/api/generate-image` — Gemini image generation + Supabase cache

### ✅ Components built
- `components/layout/Navbar.tsx` — sticky nav
- `components/layout/Footer.tsx` — full footer
- `components/suppliers/SupplierCard.tsx` — supplier grid card
- `components/ui/VerificationBadge.tsx` — Bronze/Silver/Gold badge
- `components/ui/VerificationBadge.tsx` — ScoreRing SVG component

### ✅ Infrastructure
- `src/middleware.ts` — auth protection for /dashboard and /admin
- `src/lib/supabase/client.ts` — browser Supabase client
- `src/lib/supabase/server.ts` — server Supabase client (resilient to missing env vars)
- `src/lib/stripe.ts` — lazy Stripe init via getStripe()
- `src/lib/utils.ts` — cn(), formatCurrency(), GUJARAT_CITIES, INDUSTRIES constants
- `src/types/database.ts` — TypeScript interfaces for all 8 tables
- `supabase/migrations/001_initial_schema.sql` — full DB schema + RLS

---

## Current Build Status

### Done
- [x] Project initialized (Next.js 16 + TypeScript + Tailwind v4)
- [x] All npm packages installed
- [x] Supabase client/server setup
- [x] Stripe lazy initialization (works without keys during build)
- [x] All pages built (see list above)
- [x] Auth flow (login/signup/callback)
- [x] Buyer + Supplier dashboards
- [x] Admin verification queue
- [x] Stripe API routes (checkout/webhook/portal)
- [x] Gemini image generation API
- [x] Security headers (HSTS, CSP, X-Frame-Options)
- [x] SEO (sitemap.xml, robots.txt, JSON-LD, metadata)
- [x] Deployed to Vercel (auto-deploys on git push)
- [x] GitHub: infotyswebsolution-netizen/verify-business-india

### Needs to be done
- [ ] Add Supabase keys to Vercel environment variables
- [ ] Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor
- [ ] Create Supabase Storage buckets: supplier-media, audit-reports, generated-images
- [ ] Add Stripe keys to Vercel + create 3 products (Bronze/Silver/Gold)
- [ ] Set NEXT_PUBLIC_APP_URL to production Vercel domain
- [ ] Onboard first 20 Gujarat suppliers manually

---

## How to Help Best

1. **Be specific about files** — always tell the exact file path
2. **Show complete code** — never show partial snippets with "// rest of code here"
3. **One thing at a time** — complete one task fully before moving to the next
4. **Explain breaking changes** — if changing something that affects other files, say which ones
5. **Check what exists first** — look at the "What's Already Built" section before creating files

---

## Contact & Context

- Git email: info.tyswebsolution@gmail.com
- Git name: TYS Web Solution
- Platform: Canada-based operation targeting Gujarat suppliers
- Primary buyer market: Canada, USA, UK
- Supplier geography: Surat, Rajkot, Ahmedabad, Vadodara (Gujarat, India)
- Key industries: Textiles, Diamonds/Gems, Metals & Welding, Chemicals, Pharmaceuticals
- Field auditor: Based in Gujarat, conducts physical factory visits
