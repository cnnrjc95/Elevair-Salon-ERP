import { prisma } from '@/server/db/client';
import { Card } from '@/components/ui/card';

export default async function FinancePage() {
  const cashUps = await prisma.cashUp.findMany({
    orderBy: { date: 'desc' },
    include: { location: true },
    take: 10
  });
  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: 'desc' },
    include: { client: true, location: true },
    take: 10
  });

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Accounting & Finance</h1>
        <p className="text-sm text-slate-400">
          Daily takings, VAT, deposits, tips, commissions and exports to Xero or QuickBooks.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Daily cash-up</h2>
          <div className="space-y-2 text-sm text-slate-300">
            {cashUps.map((cash) => (
              <div key={cash.id} className="flex items-center justify-between">
                <span>{cash.location.name} · {cash.date.toISOString().slice(0, 10)}</span>
                <span>
                  Cash £{Number(cash.cashTotal).toFixed(2)} · Card £{Number(cash.cardTotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Invoices</h2>
          <div className="space-y-2 text-sm text-slate-300">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between">
                <span>
                  {invoice.location.name} · {invoice.client?.firstName ?? 'Walk-in'}
                </span>
                <span>
                  £{Number(invoice.total).toFixed(2)} · {invoice.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
