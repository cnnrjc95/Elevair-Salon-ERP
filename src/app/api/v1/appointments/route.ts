import { NextRequest } from 'next/server';
import { created, ok, badRequest, serverError } from '@/server/api/response';
import { requireAuth } from '@/server/api/with-auth';
import { createAppointment, listUpcomingAppointments } from '@/server/services/appointment-service';

export async function GET(request: NextRequest) {
  const { response, session } = await requireAuth();
  if (response) return response;
  const locationId = request.nextUrl.searchParams.get('locationId');
  if (!locationId) {
    return badRequest('locationId is required');
  }
  try {
    const appointments = await listUpcomingAppointments(locationId);
    return ok(appointments);
  } catch (error) {
    console.error(error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const { response, session } = await requireAuth();
  if (response) return response;
  const payload = await request.json();
  try {
    const appointment = await createAppointment(payload, session.user!.id);
    return created(appointment);
  } catch (error) {
    console.error(error);
    return badRequest(error instanceof Error ? error.message : 'Unable to create appointment');
  }
}
