# AevixTrack

AevixTrack is a modern SaaS MVP for tracking subscriptions, free trials, renewals, and email reminder preferences. It uses Next.js 15, TypeScript, Tailwind CSS, Supabase Auth, and Prisma ORM.

## Folder Structure

```txt
prisma/
  schema.prisma              Database models for users, subscriptions, reminders, settings
src/app/
  page.tsx                   Landing page
  pricing/page.tsx           Pricing page
  login/page.tsx             Login page
  register/page.tsx          Register page
  (app)/dashboard/page.tsx   Protected dashboard
  (app)/settings/page.tsx    Protected settings
  api/                       Prisma-backed API routes
src/components/
  app/                       Sidebar, mobile nav, app topbar
  auth/                      Login/register shell and form
  dashboard/                 Dashboard UI and subscription form
  marketing/                 Landing navigation
  settings/                  Settings UI
  ui/                        Reusable primitives
src/lib/
  supabase/                  Browser/server Supabase clients
  api.ts                     Shared API auth and serializers
  validations.ts             Zod schemas
  demo-data.ts               Local demo fallback
```

## Install

```bash
npm install
npm run prisma:generate
```

On Windows, if Prisma binary downloads fail because of local certificates, run:

```bash
set NODE_OPTIONS=--use-system-ca
npm run prisma:generate
```

## Connect Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`, and `DIRECT_URL`.
4. Run the Prisma migration:

```bash
npm run prisma:migrate
```

5. In Supabase Auth, enable email/password signups.
6. Add your local redirect URL: `http://localhost:3000/dashboard`.

Until Supabase is configured, the dashboard runs in demo mode with sample subscriptions.

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy To Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add the same environment variables from `.env.example`.
4. Set the build command to `npm run build`.
5. After deployment, add the Vercel dashboard URL to Supabase Auth redirect URLs.
6. Run migrations against Supabase before production traffic:

```bash
npm run prisma:migrate
```

## Reminder Emails

The endpoint `POST /api/reminders/due` scans reminders due today. Send the header `x-cron-secret` with `CRON_SECRET`. The endpoint is ready for an email provider such as Resend, Postmark, or Supabase Edge Functions.

## Product Flow

Users land on the homepage, understand the cost of forgotten subscriptions, sign up, add subscriptions like Netflix, Spotify, Adobe, or gym memberships, then use the dashboard to see monthly spend, annual spend, upcoming renewals, and trials ending soon.

The reminder task runs daily and can send messages such as: "Your Adobe subscription renews in 3 days for GBP19.99." Cancelled and archived subscriptions stay in the account history but are excluded from active spend and renewal reminders.

Keep the MVP focused on subscription tracking, free-trial tracking, reminders, and spend clarity. Later premium ideas like Gmail scanning, bank sync, AI recommendations, shared family plans, and deeper analytics can be added once the core loop is working.
