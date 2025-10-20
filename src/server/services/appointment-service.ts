import { prisma } from '@/server/db/client';
import { addMinutes } from 'date-fns';
import { z } from 'zod';

const appointmentSchema = z.object({
  locationId: z.string(),
  clientId: z.string(),
  staffId: z.string(),
  serviceId: z.string(),
  startAt: z.string().datetime(),
  notes: z.string().optional(),
  deposit: z.number().min(0).default(0)
});

export const createAppointment = async (input: z.infer<typeof appointmentSchema>, actorId: string) => {
  const data = appointmentSchema.parse(input);
  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) {
    throw new Error('Service not found');
  }
  const start = new Date(data.startAt);
  const end = addMinutes(start, service.baseDurationMin);
  const appointment = await prisma.appointment.create({
    data: {
      locationId: data.locationId,
      clientId: data.clientId,
      staffId: data.staffId,
      startAt: start,
      endAt: end,
      createdById: actorId,
      notes: data.notes,
      deposit: data.deposit,
      totalPrice: service.basePrice,
      services: {
        create: {
          serviceId: service.id,
          staffId: data.staffId,
          durationMin: service.baseDurationMin,
          price: service.basePrice
        }
      }
    },
    include: { client: true, staff: { include: { user: true } }, services: { include: { service: true } } }
  });
  await prisma.auditLog.create({
    data: {
      actorId: actorId,
      locationId: data.locationId,
      action: 'appointment.created',
      entityType: 'appointment',
      entityId: appointment.id,
      metadata: { startAt: data.startAt, serviceId: data.serviceId }
    }
  });
  return appointment;
};

export const listUpcomingAppointments = async (locationId: string) => {
  return prisma.appointment.findMany({
    where: { locationId, startAt: { gte: new Date() } },
    orderBy: { startAt: 'asc' },
    include: {
      client: true,
      staff: { include: { user: true } },
      services: { include: { service: true } }
    },
    take: 50
  });
};
