import { prisma } from '@/server/db/client';
import { Card } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

async function getDashboardData() {
  const [locations, upcomingAppointments, todayRevenue] = await Promise.all([
    prisma.location.findMany({ orderBy: { name: 'asc' } }),
    prisma.appointment.findMany({
      where: { startAt: { gte: new Date() } },
      include: { client: true, staff: { include: { user: true } }, location: true },
      orderBy: { startAt: 'asc' },
      take: 8
    }),
    prisma.payment.aggregate({
      where: {
        processedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999))
        },
        status: 'CAPTURED'
      },
      _sum: { amount: true, tipAmount: true }
    })
  ]);

  return {
    locations,
    upcomingAppointments,
    revenue: Number(todayRevenue._sum.amount ?? 0),
    tips: Number(todayRevenue._sum.tipAmount ?? 0)
  };
}

export default async function DashboardPage() {
  const { locations, upcomingAppointments, revenue, tips } = await getDashboardData();

  return (
    <div className="space-y-8 p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Today at Elevair</h1>
          <p className="text-sm text-slate-400">Timezone Europe/London · Currency GBP (£)</p>
        </div>
        <Link
          href="/appointments"
          className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 px-4 py-2 text-sm text-brand-200 transition hover:bg-brand-500/10"
        >
          Go to calendar <ArrowUpRight size={16} />
        </Link>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-400">Revenue today</p>
            <p className="text-3xl font-semibold text-white">£{revenue.toFixed(2)}</p>
            <p className="text-xs text-slate-500">Tips £{tips.toFixed(2)}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-400">Locations</p>
            <p className="text-3xl font-semibold text-white">{locations.length}</p>
            <p className="text-xs text-slate-500">Multi-site operations ready</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-400">Upcoming visits</p>
            <p className="text-3xl font-semibold text-white">{upcomingAppointments.length}</p>
            <p className="text-xs text-slate-500">Waitlist and reminders synced</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-400">Offline POS queue</p>
            <p className="text-3xl font-semibold text-white">0</p>
            <p className="text-xs text-slate-500">Queue syncs automatically when online</p>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Upcoming appointments</h2>
          <Link href="/appointments" className="text-sm text-brand-200 hover:text-brand-100">
            View all
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {appointment.client.firstName} {appointment.client.lastName}
                </p>
                <p className="text-xs text-slate-400">
                  {appointment.services[0]?.service.name} · {appointment.location.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-200">
                  {format(new Date(appointment.startAt), 'HH:mm')} - {format(new Date(appointment.endAt), 'HH:mm')}
                </p>
                <p className="text-xs text-slate-500">with {appointment.staff?.user.firstName ?? 'TBC'}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
