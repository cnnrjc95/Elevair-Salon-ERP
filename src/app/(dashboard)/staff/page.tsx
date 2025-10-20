import { prisma } from '@/server/db/client';
import { Card } from '@/components/ui/card';

export default async function StaffPage() {
  const staff = await prisma.staffProfile.findMany({
    include: { user: true, location: true, commissionPlan: true }
  });
  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Staff, Rotas & HR</h1>
        <p className="text-sm text-slate-400">
          Manage contracts, pay rates, commission plans, skills, expiries, timesheets and training compliance.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {staff.map((member) => (
          <Card key={member.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {member.user.firstName} {member.user.lastName}
                </h2>
                <p className="text-xs text-slate-500">{member.location.name}</p>
              </div>
              <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-100">{member.staffLevel}</span>
            </div>
            <p className="text-xs text-slate-400">Skills: {Array.isArray(member.skills) ? member.skills.join(', ') : ''}</p>
            <p className="text-xs text-slate-400">Pay rate: £{Number(member.payRate).toFixed(2)}/hr</p>
            <p className="text-xs text-slate-400">
              Commission plan: {member.commissionPlan?.name ?? 'Not assigned'}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
