import { ReactNode } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/pos', label: 'POS' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/staff', label: 'Staff & HR' },
  { href: '/finance', label: 'Finance' },
  { href: '/marketing', label: 'Marketing' },
  { href: '/reports', label: 'Reports' },
  { href: '/settings', label: 'Settings' }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10 lg:px-10">
        <aside className="hidden w-56 flex-shrink-0 flex-col gap-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:flex">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Elevair HQ</h2>
            <p className="text-xs text-slate-500">Multi-location salon ERP</p>
          </div>
          <nav className="mt-6 space-y-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-4 py-2 text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-600">›</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
