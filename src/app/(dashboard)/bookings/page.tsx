import { Card } from '@/components/ui/card';
import { prisma } from '@/server/db/client';

export default async function BookingsPage() {
  const waitlist = await prisma.waitlistEntry.findMany({
    include: { client: true, appointment: { include: { services: { include: { service: true } } } } },
    orderBy: { requestedAt: 'asc' },
    take: 20
  });

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Online bookings & waitlist</h1>
        <p className="text-sm text-slate-400">
          Manage self-service bookings, deposits, cancellation policies and automated reminder flows.
        </p>
      </header>
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Waitlist</h2>
        <div className="space-y-2 text-sm text-slate-300">
          {waitlist.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between">
              <span>
                {entry.client.firstName} {entry.client.lastName}
              </span>
              <span>{entry.appointment.services[0]?.service.name}</span>
              <span>{entry.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
