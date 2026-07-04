# IP Success – Ayurvedic Piles Care Website

A complete, production-ready full-stack Next.js 15 application for IP Success Ayurvedic Healthcare.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Razorpay
- **Email**: Resend
- **Images**: Cloudinary
- **Charts**: Recharts
- **i18n**: next-intl (EN, Hindi, Gujarati, Hinglish)

## Quick Start

### 1. Clone & Install

```bash
cd "ip-success"
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all your API keys.

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**
3. Copy and run the contents of `supabase/migrations/001_initial_schema.sql`
4. This creates all tables, RLS policies, and seed data automatically

### 4. Create Admin User

In Supabase Dashboard → **Authentication** → **Users** → **Add User**:
- Email: `admin@ipsuccess.in`
- Password: (choose a strong password)

### 5. Set Up Razorpay

1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from **Settings → API Keys**
3. Add to `.env.local`

#### For Webhook (Local Development with ngrok):

```bash
# Install ngrok
npm install -g ngrok

# Start dev server
npm run dev

# In another terminal, tunnel to your local server
ngrok http 3000
```

Copy the ngrok HTTPS URL (e.g., `https://abc123.ngrok.io`) and:
- Go to Razorpay Dashboard → **Settings → Webhooks**
- Add webhook URL: `https://abc123.ngrok.io/api/razorpay/webhook`
- Select events: `payment.captured`, `payment.failed`
- Copy the webhook secret to `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

#### For Production (Vercel):

- Webhook URL: `https://yourdomain.com/api/razorpay/webhook`

### 6. Set Up Resend

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Get API key and add to `.env.local`

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Project Structure

```
ip-success/
├── app/
│   ├── (public)/          # Landing page + Checkout
│   ├── admin/             # Full admin panel
│   └── api/               # API routes
├── components/
│   ├── landing/           # Landing page components
│   ├── admin/             # Admin UI components
│   └── ui/                # Shared components
├── lib/                   # Supabase, Razorpay, Resend, utils
├── messages/              # i18n translations (EN, HI, GU, Hinglish)
├── types/                 # TypeScript interfaces
├── supabase/migrations/   # Database schema SQL
└── .env.local.example     # Environment variable template
```

---

## Features

### Public Landing Page
- ✅ Responsive hero section with animated product image
- ✅ Emotional pain points section in Hinglish
- ✅ Combo offers with pricing (Starter ₹2,475 / Best Value ₹3,725)
- ✅ Trust seals scrolling marquee
- ✅ 14-Day protocol steps
- ✅ 6-testimonial grid
- ✅ FAQ accordion
- ✅ Floating WhatsApp button with pulse animation
- ✅ Language switcher (EN / हिं / GU / Hinglish) via cookie
- ✅ Fully responsive mobile design

### Checkout
- ✅ Address form with Indian state selector
- ✅ Razorpay online payment
- ✅ Cash on Delivery support
- ✅ Form validation (react-hook-form + Zod)
- ✅ Order confirmation email via Resend

### Admin Panel (`/admin`)
- ✅ Supabase Auth login
- ✅ Dashboard: stats, revenue chart, inventory bars, recent orders
- ✅ Low stock alerts
- ✅ Orders: filterable table, status update, tracking ID, WhatsApp customer
- ✅ Order detail: full info + printable invoice + shipping label
- ✅ Quick Order: fast form for phone/WhatsApp orders
- ✅ Inventory: stock bars, add stock, threshold management
- ✅ Reports: bar chart, pie chart, CSV export
- ✅ Content CMS: edit all landing page text in all languages
- ✅ Testimonials: CRUD with toggle active/inactive
- ✅ Settings: WhatsApp number, COD toggle, payment toggles

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables from `.env.local` in the Vercel Dashboard under **Settings → Environment Variables**.

Make sure to update the Razorpay webhook URL to your production domain.

---

## Business Rules

| Pack | Price | Items |
|------|-------|-------|
| Starter Pack (Initial Stage) | ₹2,475 | 1x Syrup + 1x Powder |
| Best Value Pack (Chronic/Near-Surgery) | ₹3,725 | 2x Syrup + 1x Powder |

- Only combo packs are sold (no individual products)
- Free shipping across India
- COD available across India (can be toggled in admin settings)

---

## Support

📱 WhatsApp: +91 99250 50013
📧 Email: support@ipsuccess.in
