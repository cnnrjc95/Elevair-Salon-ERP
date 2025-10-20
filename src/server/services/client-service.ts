import { prisma } from '@/server/db/client';

export const listClients = async (search?: string) => {
  return prisma.client.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }
      : undefined,
    include: {
      loyaltyLedger: true,
      memberships: { include: { plan: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 200
  });
};

export const exportClientData = async (clientId: string) => {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      appointments: { include: { services: { include: { service: true } } } },
      loyaltyLedger: true,
      memberships: { include: { plan: true } },
      packages: true,
      giftCards: true,
      consentForms: true
    }
  });
  return client;
};
