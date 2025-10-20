import { NextRequest } from 'next/server';
import { ok, badRequest } from '@/server/api/response';
import { requireAuth } from '@/server/api/with-auth';
import { exportClientData } from '@/server/services/client-service';

export async function GET(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  const clientId = request.nextUrl.searchParams.get('clientId');
  if (!clientId) {
    return badRequest('clientId is required');
  }
  const client = await exportClientData(clientId);
  return ok(client);
}
