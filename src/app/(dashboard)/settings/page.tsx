import { prisma } from '@/server/db/client';
import { Card } from '@/components/ui/card';

export default async function SettingsPage() {
  const locations = await prisma.location.findMany({ include: { settings: true } });
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-semibold text-white">Admin settings</h1>
      <p className="text-sm text-slate-400">
        Role-based access ensures only owners and managers can modify policies, deposits, VAT rules, automation and integrations.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {locations.map((location) => (
          <Card key={location.id} className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-white">{location.name}</h2>
              <p className="text-xs text-slate-500">{location.addressLine1}</p>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Deposit policy: {JSON.stringify(location.settings?.depositPolicy)}</p>
              <p>Cancellation: {JSON.stringify(location.settings?.cancellationPolicy)}</p>
              <p>Reminders: {JSON.stringify(location.settings?.reminderPolicy)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
