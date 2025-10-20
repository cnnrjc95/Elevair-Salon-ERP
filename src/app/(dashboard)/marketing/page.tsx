import { prisma } from '@/server/db/client';
import { Card } from '@/components/ui/card';

export default async function MarketingPage() {
  const campaigns = await prisma.campaign.findMany({ include: { sends: true }, take: 10 });
  const segments = await prisma.segment.findMany({ include: { memberships: true }, take: 10 });
  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Marketing & Online Booking</h1>
        <p className="text-sm text-slate-400">
          Launch campaigns across email, SMS, WhatsApp with A/B testing, loyalty, memberships and referral automation.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Campaigns</h2>
          <div className="space-y-2 text-sm text-slate-300">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between">
                <span>{campaign.name} · {campaign.channel}</span>
                <span>{campaign.status} · Sends {campaign.sends.length}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Segments</h2>
          <div className="space-y-2 text-sm text-slate-300">
            {segments.map((segment) => (
              <div key={segment.id} className="flex items-center justify-between">
                <span>{segment.name}</span>
                <span>{segment.memberships.length} members</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
