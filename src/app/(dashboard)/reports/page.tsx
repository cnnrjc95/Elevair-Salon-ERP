import { Card } from '@/components/ui/card';
import { prisma } from '@/server/db/client';
import { format } from 'date-fns';

export default async function ReportsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { processedAt: 'desc' },
    include: { appointment: { include: { client: true, staff: { include: { user: true } } } } },
    take: 20
  });

  return (
    <div className="space-y-6 p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Reports & Analytics</h1>
        <p className="text-sm text-slate-400">
          Export CSVs, schedule email delivery, and integrate with BI tools using the REST API and webhooks.
        </p>
      </header>
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent takings</h2>
          <a
            href="/api/v1/reports/export?report=sales-by-staff&locationId"
            className="text-sm text-brand-200 hover:text-brand-100"
          >
            Download CSV
          </a>
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-none">
              <span>
                £{Number(payment.amount).toFixed(2)} · {payment.method.replace('_', ' ')}
              </span>
              <span>
                {payment.appointment?.client.firstName} {payment.appointment?.client.lastName} ·{' '}
                {format(new Date(payment.processedAt), 'PPpp')}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
