import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/api/with-auth';
import { exportCsv } from '@/server/services/report-service';
import { prisma } from '@/server/db/client';

export async function GET(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  const report = request.nextUrl.searchParams.get('report') ?? 'sales-by-staff';
  const locationId = request.nextUrl.searchParams.get('locationId');
  if (!locationId) {
    return new Response('locationId required', { status: 400 });
  }
  const data = await prisma.appointment.findMany({
    where: { locationId },
    include: {
      staff: { include: { user: true } },
      services: { include: { service: true } }
    },
    take: 200
  });
  const rows = data.map((appt) => ({
    staff: appt.staff?.user.firstName ?? 'Unassigned',
    clientId: appt.clientId,
    total: Number(appt.totalPrice),
    status: appt.status,
    startAt: appt.startAt.toISOString()
  }));
  const csv = exportCsv(rows);
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${report}.csv"`
    }
  });
}
