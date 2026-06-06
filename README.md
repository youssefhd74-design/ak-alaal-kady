# AK - Alaal Kady 🔧

> متخصصون في صيانة سيارات رينو | Renault Car Maintenance Specialists

A full-stack Next.js web application for AK - Alaal Kady car maintenance company, featuring a product storefront, appointment booking, and a complete admin dashboard. Built in Arabic (default) and English.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Cairo font |
| i18n | next-intl (AR/EN, RTL/LTR) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (product images) |
| Auth | HTTP-only cookie session |
| Deployment | Vercel (auto-deploy from GitHub) |
| CI | GitHub Actions |

---

## Features

### Customer-facing
- 🛍️ **Product storefront** — browse parts, search, filter by category, add to cart
- 🛒 **Order flow** — checkout with delivery details, WhatsApp confirmation popup
- 📅 **Booking system** — maintenance or malfunction appointment, car info, preferred date
- 🌐 **AR/EN toggle** — full RTL/LTR support, Arabic default

### Admin Dashboard (`/admin`)
- 📦 **Products** — add, edit, delete, toggle visibility, stock management
- 🧾 **Orders** — view all orders, update status, see item details
- 📆 **Appointments** — view bookings, update status, filter by state
- ⚙️ **Settings** — set WhatsApp number, business info, delivery areas

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ak-alaal-kady.git
cd ak-alaal-kady
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `ak-alaal-kady`, choose a region close to Egypt (e.g. Frankfurt)
3. After creation, go to **SQL Editor** → paste and run the contents of `supabase/schema.sql`
4. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=your_secure_password_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/ar` automatically.

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit: AK Alaal Kady"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ak-alaal-kady.git
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no framework config needed

### Step 3 — Add Environment Variables on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
| `ADMIN_PASSWORD` | a strong password |
| `NEXT_PUBLIC_APP_URL` | your vercel domain e.g. `https://ak-alaal-kady.vercel.app` |

### Step 4 — Deploy

Click **Deploy**. Every push to `main` auto-deploys.

---

## GitHub Secrets for CI

In your GitHub repo → **Settings → Secrets and variables → Actions**, add the same 5 variables above so the CI build works.

---

## Adding WhatsApp Number

1. Go to `/admin` → login → **Settings**
2. Enter your WhatsApp number with country code, no `+` (e.g. `201012345678`)
3. Save — customers will now see a WhatsApp button after placing orders/bookings

---

## QR Code for Car Dashboard

Once deployed, generate a QR code pointing to:
```
https://your-domain.vercel.app/ar/products
```

Use any free QR generator (e.g. [qr-code-generator.com](https://www.qr-code-generator.com)). Print and stick in the car tableau.

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Customer pages (ar/en)
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product storefront
│   │   └── booking/       # Booking + confirmation
│   ├── admin/             # Admin dashboard (no locale)
│   │   ├── page.tsx       # Dashboard overview
│   │   ├── products/
│   │   ├── orders/
│   │   ├── appointments/
│   │   └── settings/
│   └── api/               # API routes
│       ├── products/
│       ├── orders/
│       ├── appointments/
│       ├── settings/
│       └── admin-auth/
├── components/
│   ├── shared/            # Navbar, Footer
│   ├── storefront/        # ProductsClient
│   └── admin/             # All admin components
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── database.types.ts  # TypeScript types
│   └── admin-auth.ts      # Cookie auth helpers
└── messages/
    ├── ar.json            # Arabic translations
    └── en.json            # English translations
supabase/
└── schema.sql             # Full DB schema + seed data
```

---

## Admin Password

Default in `.env.local` is `ak2024secure` — **change this before deploying**.

The admin is protected by an HTTP-only cookie. There's no public registration.

---

## License

Private project — AK Alaal Kady © 2024
