import { NextRequest } from 'next/server';
import { created, badRequest } from '@/server/api/response';
import { requireAuth } from '@/server/api/with-auth';
import { createPurchaseOrder } from '@/server/services/inventory-service';

export async function POST(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  try {
    const payload = await request.json();
    const po = await createPurchaseOrder(payload);
    return created(po);
  } catch (error) {
    console.error(error);
    return badRequest(error instanceof Error ? error.message : 'Unable to create purchase order');
  }
}
