import { NextRequest } from 'next/server';
import { ok, badRequest } from '@/server/api/response';
import { requireAuth } from '@/server/api/with-auth';
import { listLowStock } from '@/server/services/inventory-service';

export async function GET(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  const locationId = request.nextUrl.searchParams.get('locationId');
  if (!locationId) {
    return badRequest('locationId is required');
  }
  const threshold = Number(request.nextUrl.searchParams.get('threshold') ?? 5);
  const products = await listLowStock(locationId, threshold);
  return ok(products);
}
