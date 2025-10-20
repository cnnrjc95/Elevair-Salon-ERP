# Elevair Salon ERP

Elevair is a production-ready salon ERP tailored for UK operators. It delivers multi-location scheduling, POS with offline sync, CRM, inventory, finance, marketing automation, and analytics in a single platform.

## Tech stack

- **Next.js 14 (App Router, TypeScript, TailwindCSS)** for the dark, mobile-first UI.
- **Prisma + PostgreSQL** for relational data modelling and migrations.
- **NextAuth** with email/password, Google OAuth, and 2FA hooks ready for SSO.
- **Stripe** for card, Apple Pay, Google Pay payments; cash handling baked in.
- **React Query** for client data fetching, plus offline POS queue utilities.
- **Playwright + Vitest + ESLint + Prettier** for quality gates.
- **Docker Compose** to spin up PostgreSQL locally.

## Getting started

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and adjust secrets. Minimum variables:

   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `STRIPE_SECRET_KEY`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

3. **Run database**

   ```bash
   docker compose up -d
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Start the app**

   ```bash
   npm run dev
   ```

   App is available at `http://localhost:3000`.

## Testing & linting

```bash
npm run lint
npm run test
npm run e2e
```

Playwright scripts rely on the dev server at `http://localhost:3000`.

## Project structure

```
src/
  app/                 # App Router routes (dashboard, portal, APIs)
  components/          # UI building blocks
  server/              # Prisma client, services, auth
  lib/                 # Utilities (rbac, offline queue)
prisma/
  schema.prisma        # Database models and relations
  seed.ts              # Seed data for demo/QA
```

## Features snapshot

- Appointments & resources with deposits, waitlist, reminders, kiosk check-in.
- POS with Stripe, cash, tips, commissions, VAT, daily cash-up and offline queue sync.
- CRM with loyalty, memberships, consent forms, GDPR export.
- Services, add-ons, bundles, staff eligibility, service BOMs driving inventory usage.
- Inventory with purchase orders, stocktakes, transfers, adjustments and alerts.
- Staff & HR: rotas, time-off, timesheets, payroll exports, training log placeholders.
- Finance & accounting: invoices, payments, cash-up, exports.
- Marketing: segments, campaigns (email/SMS/WhatsApp), online booking portal.
- Reports & analytics dashboards with CSV exports.
- REST API under `/api/v1/*`, webhooks, offline POS sync, API key scaffolding.
- Security: RBAC, audit logs, 2FA-ready auth, GDPR compliance, WCAG dark UI.

## Seed data

`npm run prisma:seed` loads:

- 2 demo locations with schedules and resources.
- Owner, managers, stylists, reception users with hashed demo password `Demo123!`.
- Services, bundles, inventory products with stock per location.
- 150 clients, loyalty balances, memberships.
- Sample appointments, payments, campaigns, waitlist entries, reports.

## Integrations

- Stripe payment intents ready via `/api/v1/payments/intent`.
- Webhook scaffolding for Stripe, WhatsApp/SMS, Shopify/Woo, accounting and calendars.
- Offline POS queue sync endpoints at `/api/v1/pos/offline`.
- Report exports and scheduled reports under `/api/v1/reports/*`.

## CI ready

Ship with linting, tests and type checking before deploy. Add your favourite CI service (GitHub Actions, GitLab CI) to run `npm run lint`, `npm run test`, `npm run build`.

## License

Commercial license required.
