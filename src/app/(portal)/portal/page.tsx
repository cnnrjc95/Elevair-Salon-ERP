import { prisma } from '@/server/db/client';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default async function PortalPage() {
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' }, take: 20 });
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold text-white">Elevair client portal</h1>
          <p className="text-sm text-slate-400">
            Real-time availability, deposits collected upfront, add-ons and upsells seamlessly built in. Secure guest access with loyalty, memberships and gift card redemption.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-400"
          >
            Staff area
          </Link>
        </header>
        <section className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id} className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                <p className="text-sm text-slate-400">{service.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{service.baseDurationMin} min</span>
                <span>£{Number(service.basePrice).toFixed(2)}</span>
              </div>
              <Link
                href={`/portal/book?serviceId=${service.id}`}
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400"
              >
                Book now
              </Link>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
