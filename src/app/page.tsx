import Link from 'next/link';
import { ArrowRight, CalendarCheck2, CreditCard, Users } from 'lucide-react';

const heroStats = [
  { label: 'Locations live', value: '4' },
  { label: 'Appointments handled', value: '2.6M' },
  { label: 'Inventory SKUs tracked', value: '12k' }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="space-y-12 text-center">
          <span className="rounded-full bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
            Elevair Salon ERP
          </span>
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Power every guest experience from hello to encore.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Elevair orchestrates appointments, teams, inventory, payments, and growth across every
            salon location. Built for the UK market with native VAT, GBP (£) workflows, and London
            timezone scheduling.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/portal/login"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
            >
              Launch client portal
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400 hover:text-white"
            >
              Staff sign-in
            </Link>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6">
                <dt className="text-sm uppercase tracking-wide text-slate-400">{stat.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-24 grid gap-8 rounded-3xl border border-slate-800/70 bg-slate-900/50 p-10 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Everything the front-of-house sees.</h2>
            <p className="text-slate-300">
              Live calendar with drag-and-drop rescheduling, automated reminders, walk-in kiosk, and
              waitlist blending for the busiest Saturdays.
            </p>
            <ul className="space-y-4 text-left text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <CalendarCheck2 className="text-brand-400" />
                Multi-location availability, rota enforcement, and double-booking prevention.
              </li>
              <li className="flex items-center gap-3">
                <CreditCard className="text-brand-400" />
                POS with offline-first queue, Stripe and cash handling, digital receipts, VAT rules.
              </li>
              <li className="flex items-center gap-3">
                <Users className="text-brand-400" />
                Role-based permissions and 2FA keep every interaction auditable.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-slate-900 to-slate-950 p-8">
            <h3 className="text-xl font-semibold text-white">Compliance & Trust</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>🇬🇧 UK-ready VAT, Making Tax Digital exports, and Xero/QuickBooks sync.</li>
              <li>GDPR tooling: client data export/delete, marketing preferences, audit trails.</li>
              <li>ISO27001-aligned logging, alerting, and SSO-ready auth.</li>
              <li>WCAG AA interface with keyboard-friendly interactions.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
