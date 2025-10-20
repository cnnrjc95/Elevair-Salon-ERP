import { NextRequest } from 'next/server';
import { created, badRequest } from '@/server/api/response';
import { requireAuth } from '@/server/api/with-auth';
import { createPaymentIntent } from '@/server/services/payment-service';

export async function POST(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  try {
    const payload = await request.json();
    const intent = await createPaymentIntent(payload);
    return created(intent);
  } catch (error) {
    console.error(error);
    return badRequest(error instanceof Error ? error.message : 'Unable to create payment intent');
  }
}
