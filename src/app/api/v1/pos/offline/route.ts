import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/api/with-auth';
import { created, ok } from '@/server/api/response';
import { prisma } from '@/server/db/client';

export async function POST(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  const payload = await request.json();
  const record = await prisma.offlineSale.create({
    data: {
      locationId: payload.locationId,
      payload,
      status: 'queued'
    }
  });
  return created(record);
}

export async function PATCH(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  const payload = await request.json();
  const { ids } = payload as { ids: string[] };
  await prisma.offlineSale.updateMany({ where: { id: { in: ids } }, data: { status: 'synced', syncedAt: new Date() } });
  return ok({ updated: ids.length });
}
