import { NextRequest } from 'next/server';
import { ok } from '@/server/api/response';
import { requireAuth } from '@/server/api/with-auth';
import { listClients } from '@/server/services/client-service';

export async function GET(request: NextRequest) {
  const { response } = await requireAuth();
  if (response) return response;
  const search = request.nextUrl.searchParams.get('search') ?? undefined;
  const clients = await listClients(search ?? undefined);
  return ok(clients);
}
