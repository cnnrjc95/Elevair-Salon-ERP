import { prisma } from '@/server/db/client';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function AppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      client: true,
      staff: { include: { user: true } },
      services: { include: { service: true } },
      location: true
    },
    orderBy: { startAt: 'asc' },
    take: 50
  });

  return (
    <div className="space-y-6 p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Appointments & Resources</h1>
          <p className="text-sm text-slate-400">
            Drag & drop scheduling, deposits, and resource assignments. Double-booking prevention and rota compliance enforced via Prisma constraints.
          </p>
        </div>
        <Link
          href="/api/v1/appointments?locationId"
          className="rounded-full border border-brand-500/40 px-4 py-2 text-sm text-brand-200 hover:bg-brand-500/10"
        >
          Sync via API
        </Link>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {appointment.client.firstName} {appointment.client.lastName}
                </p>
                <p className="text-xs text-slate-500">{appointment.location.name}</p>
              </div>
              <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-100">
                {appointment.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{appointment.services[0]?.service.name}</span>
              <span>
                {format(new Date(appointment.startAt), 'PPpp')} → {format(new Date(appointment.endAt), 'HH:mm')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Stylist: {appointment.staff?.user.firstName ?? 'TBC'}</span>
              <span>
                Deposit £{Number(appointment.deposit).toFixed(2)} · Total £
                {Number(appointment.totalPrice).toFixed(2)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
