import { NextRequest } from 'next/server';
import { ok, badRequest } from '@/server/api/response';
import { requireAuth } from '@/server/api/with-auth';
import { revenueSummary, noShowRate } from '@/server/services/report-service';

export async function GET(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  const locationId = request.nextUrl.searchParams.get('locationId');
  const startParam = request.nextUrl.searchParams.get('start');
  const endParam = request.nextUrl.searchParams.get('end');
  if (!locationId || !startParam || !endParam) {
    return badRequest('locationId, start, and end are required');
  }
  const start = new Date(startParam);
  const end = new Date(endParam);
  const [revenue, noShow] = await Promise.all([
    revenueSummary(locationId, start, end),
    noShowRate(locationId, start, end)
  ]);
  return ok({ revenue, noShowRate: noShow });
}
