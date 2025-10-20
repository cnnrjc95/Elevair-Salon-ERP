import {
  PrismaClient,
  RoleName,
  VATRate,
  CommissionBasis,
  CampaignChannel,
  PaymentMethodType,
  ReportFrequency
} from '@prisma/client';
import { addMinutes, addDays } from 'date-fns';

const prisma = new PrismaClient();

const locationSeeds = [
  {
    name: 'Elevair Shoreditch',
    code: 'LDN-SHO',
    email: 'shoreditch@elevair.co.uk',
    phone: '+442045678900',
    addressLine1: '140 Curtain Road',
    city: 'London',
    postalCode: 'EC2A 3AR'
  },
  {
    name: 'Elevair Mayfair',
    code: 'LDN-MAY',
    email: 'mayfair@elevair.co.uk',
    phone: '+442045678901',
    addressLine1: '22 Hanover Square',
    city: 'London',
    postalCode: 'W1S 1JP'
  }
];

const services = [
  { name: 'Signature Cut & Finish', duration: 60, price: 95 },
  { name: 'Balayage & Gloss', duration: 150, price: 210 },
  { name: 'Hydra Facial', duration: 45, price: 85 },
  { name: 'Gel Manicure Deluxe', duration: 50, price: 55 },
  { name: 'Wellness Massage 60', duration: 60, price: 75 }
];

const retailProducts = Array.from({ length: 50 }).map((_, idx) => ({
  sku: `PROD-${idx + 1}`.padStart(7, '0'),
  name: `Retail Product ${idx + 1}`,
  costPrice: 12 + (idx % 5) * 3,
  retailPrice: 22 + (idx % 5) * 5,
  minStock: 5,
  maxStock: 25
}));

const clientFirstNames = ['Olivia', 'Noah', 'Charlotte', 'Leo', 'Isla', 'Theo', 'Freya', 'Maya', 'Arthur', 'Mila'];
const clientLastNames = ['Johnson', 'Reid', 'Campbell', 'Turner', 'Patel', 'Ahmed', 'Davies', 'Kelly', 'Murphy', 'Thompson'];

async function main() {
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
  await prisma.client.deleteMany();
  await prisma.inventoryProduct.deleteMany();

  const permissions = [
    ['appointments.manage', 'Manage appointments'],
    ['appointments.view', 'View appointments'],
    ['pos.manage', 'Manage POS'],
    ['inventory.manage', 'Manage inventory'],
    ['staff.manage', 'Manage staff'],
    ['finance.manage', 'Manage finance'],
    ['reports.view', 'View reports'],
    ['settings.manage', 'Manage settings']
  ];

  const permissionRecords = await Promise.all(
    permissions.map(([key, label]) =>
      prisma.permission.create({ data: { key, label, description: label } })
    )
  );

  const roleMatrix: Record<RoleName, string[]> = {
    [RoleName.OWNER]: permissions.map(([key]) => key),
    [RoleName.MANAGER]: ['appointments.manage', 'pos.manage', 'inventory.manage', 'staff.manage', 'reports.view'],
    [RoleName.RECEPTION]: ['appointments.manage', 'appointments.view', 'pos.manage'],
    [RoleName.STYLIST]: ['appointments.view'],
    [RoleName.ACCOUNTANT]: ['finance.manage', 'reports.view'],
    [RoleName.INVENTORY]: ['inventory.manage', 'reports.view'],
    [RoleName.HR]: ['staff.manage', 'reports.view']
  };

  const roleRecords = await Promise.all(
    Object.entries(roleMatrix).map(([name, permKeys]) =>
      prisma.role.create({
        data: {
          name: name as RoleName,
          description: `${name} role`,
          permissions: {
            create: permKeys.map((key) => ({
              permissionId: permissionRecords.find((p) => p.key === key)!.id
            }))
          }
        }
      })
    )
  );

  const locations = [] as Array<
    Awaited<ReturnType<typeof prisma.location.create>> & { resources: { id: string }[] }
  >;

  for (const loc of locationSeeds) {
    const created = await prisma.location.create({
      data: {
        ...loc,
        addressLine2: 'Unit 2',
        country: 'GB',
        settings: {
          create: {
            openingHours: {
              monday: ['09:00', '20:00'],
              tuesday: ['09:00', '20:00'],
              wednesday: ['09:00', '20:00'],
              thursday: ['09:00', '20:00'],
              friday: ['09:00', '21:00'],
              saturday: ['09:00', '19:00'],
              sunday: []
            },
            depositPolicy: { type: 'percentage', value: 25 },
            cancellationPolicy: { windowHours: 24, feePercent: 50 },
            reminderPolicy: { windows: ['PT24H', 'PT2H'], channels: ['email', 'sms', 'whatsapp'] },
            branding: { primaryColor: '#2641ff' },
            taxConfiguration: { defaultVatRate: 'STANDARD' },
            checkoutConfiguration: { tipSuggestions: [5, 10, 15] }
          }
        }
      }
    });

    await prisma.resource.createMany({
      data: [
        { name: 'Chair A', type: 'CHAIR', capacity: 1, locationId: created.id },
        { name: 'Chair B', type: 'CHAIR', capacity: 1, locationId: created.id },
        { name: 'Treatment Room', type: 'ROOM', capacity: 1, locationId: created.id }
      ]
    });

    const resourceRecords = await prisma.resource.findMany({ where: { locationId: created.id } });
    locations.push({ ...created, resources: resourceRecords });
  }

  const ownerRole = roleRecords.find((role) => role.name === RoleName.OWNER)!;
  const managerRole = roleRecords.find((role) => role.name === RoleName.MANAGER)!;
  const stylistRole = roleRecords.find((role) => role.name === RoleName.STYLIST)!;
  const receptionRole = roleRecords.find((role) => role.name === RoleName.RECEPTION)!;

  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner@elevair.co.uk',
      passwordHash: '$2b$12$VdeEOZNb1xR0a7CmYpdm3OM1Y70xDHMhZ1IsfRSAxEPPYU.GOCa.u', // bcrypt for Demo123!
      firstName: 'Amelia',
      lastName: 'Hart',
      phone: '+447700900123',
      roles: {
        create: locations.map((location) => ({ roleId: ownerRole.id, locationId: location.id }))
      }
    }
  });

  const staffUsers = await Promise.all(
    ['Luca', 'Priya', 'Jade', 'Elliot'].map((firstName, idx) =>
      prisma.user.create({
        data: {
          email: `${firstName.toLowerCase()}@elevair.co.uk`,
          passwordHash: '$2b$12$VdeEOZNb1xR0a7CmYpdm3OM1Y70xDHMhZ1IsfRSAxEPPYU.GOCa.u',
          firstName,
          lastName: ['Rossi', 'Singh', 'Taylor', 'Wells'][idx],
          roles: {
            create: [
              { roleId: managerRole.id, locationId: locations[idx % locations.length].id },
              { roleId: stylistRole.id, locationId: locations[idx % locations.length].id }
            ]
          }
        }
      })
    )
  );

  const receptionUser = await prisma.user.create({
    data: {
      email: 'frontdesk@elevair.co.uk',
      passwordHash: '$2b$12$VdeEOZNb1xR0a7CmYpdm3OM1Y70xDHMhZ1IsfRSAxEPPYU.GOCa.u',
      firstName: 'Sophie',
      lastName: 'Lane',
      roles: { create: [{ roleId: receptionRole.id, locationId: locations[0]!.id }] }
    }
  });

  const commissionPlan = await prisma.commissionPlan.create({
    data: {
      name: 'Stylist Tiered Plan',
      basis: CommissionBasis.BOTH,
      tiers: [
        { threshold: 0, serviceRate: 0.1, retailRate: 0.05 },
        { threshold: 1000, serviceRate: 0.15, retailRate: 0.08 }
      ]
    }
  });

  const staffProfiles = await Promise.all(
    staffUsers.map((user, idx) =>
      prisma.staffProfile.create({
        data: {
          userId: user.id,
          locationId: locations[idx % locations.length].id,
          title: 'Senior Stylist',
          staffLevel: idx % 2 === 0 ? 'Director' : 'Senior',
          skills: ['Colour', 'Cutting', 'Massage'],
          payRate: 18,
          commissionPlanId: commissionPlan.id
        }
      })
    )
  );

  await prisma.staffProfile.create({
    data: {
      userId: receptionUser.id,
      locationId: locations[0]!.id,
      title: 'Front of House',
      staffLevel: 'Reception',
      skills: ['Customer Service'],
      payRate: 15
    }
  });

  const serviceCategory = await prisma.serviceCategory.create({ data: { name: 'Hair' } });

  const serviceRecords = await Promise.all(
    services.map((service, idx) =>
      prisma.service.create({
        data: {
          name: service.name,
          baseDurationMin: service.duration,
          basePrice: service.price,
          categoryId: serviceCategory.id,
          description: `${service.name} tailored to the guest.`,
          vatRate: VATRate.STANDARD,
          addOns: {
            create: [
              { name: 'Bonding Treatment', durationMin: 15, price: 25 },
              { name: 'Luxury Mask', durationMin: 10, price: 12 }
            ]
          }
        }
      })
    )
  );

  await Promise.all(
    serviceRecords.map((service) =>
      prisma.serviceBomItem.create({
        data: {
          serviceId: service.id,
          product: {
            create: {
              sku: `KIT-${service.id.slice(0, 5)}`,
              name: `${service.name} Kit`,
              costPrice: 9,
              retailPrice: 0,
              vatRate: VATRate.STANDARD,
              minStock: 2,
              maxStock: 10
            }
          },
          quantity: 1
        }
      })
    )
  );

  await Promise.all(
    retailProducts.map((product) =>
      prisma.inventoryProduct.create({
        data: {
          sku: product.sku,
          name: product.name,
          costPrice: product.costPrice,
          retailPrice: product.retailPrice,
          vatRate: VATRate.STANDARD,
          minStock: product.minStock,
          maxStock: product.maxStock,
          locationBins: {
            create: locations.map((location) => ({
              bin: {
                connectOrCreate: {
                  where: { name_locationId: { name: 'Retail', locationId: location.id } },
                  create: { name: 'Retail', locationId: location.id }
                }
              },
              quantity: 20
            }))
          }
        }
      })
    )
  );

  const clients = await Promise.all(
    Array.from({ length: 150 }).map((_, idx) =>
      prisma.client.create({
        data: {
          firstName: clientFirstNames[idx % clientFirstNames.length]!,
          lastName: clientLastNames[idx % clientLastNames.length]!,
          email: `client${idx + 1}@example.com`,
          phone: `+44770090${(100 + idx).toString().slice(-3)}`,
          marketingOptIn: idx % 3 === 0,
          loyaltyLedger: { create: { locationId: locations[0]!.id, points: 200, reason: 'Welcome bonus' } }
        }
      })
    )
  );

  await prisma.membershipPlan.create({
    data: {
      name: 'Blow-Dry Club',
      tier: 'Silver',
      monthlyFee: 45,
      benefits: { visitsPerMonth: 2, guestPasses: 1 }
    }
  });

  const now = new Date();
  const appointmentPromises = clients.slice(0, 24).map((client, idx) => {
    const location = locations[idx % locations.length]!;
    const staff = staffProfiles[idx % staffProfiles.length]!;
    const service = serviceRecords[idx % serviceRecords.length]!;
    const start = addDays(now, idx % 7);
    const startAt = new Date(start.setHours(10 + (idx % 5), 0, 0, 0));
    const endAt = addMinutes(startAt, service.baseDurationMin);
    return prisma.appointment.create({
      data: {
        locationId: location.id,
        clientId: client.id,
        staffId: staff.id,
        createdById: ownerUser.id,
        startAt,
        endAt,
        status: idx % 10 === 0 ? 'NO_SHOW' : 'CONFIRMED',
        deposit: service.basePrice * 0.25,
        totalPrice: service.basePrice,
        services: {
          create: {
            serviceId: service.id,
            staffId: staff.id,
            durationMin: service.baseDurationMin,
            price: service.basePrice
          }
        },
        ...(location.resources.length
          ? {
              resources: {
                create: location.resources.slice(0, 1).map((resource) => ({ resourceId: resource.id }))
              }
            }
          : {}),
        payments: {
          create: {
            locationId: location.id,
            method: PaymentMethodType.STRIPE_CARD,
            status: 'CAPTURED',
            amount: service.basePrice,
            tipAmount: 10
          }
        }
      }
    });
  });

  const appointments = await Promise.all(appointmentPromises);

  await prisma.waitlistEntry.createMany({
    data: appointments.slice(0, 5).map((appointment, idx) => ({
      appointmentId: appointment.id,
      clientId: appointments[(idx + 1) % appointments.length]!.clientId,
      status: 'pending'
    }))
  });

  const campaign = await prisma.campaign.create({
    data: {
      name: 'Rebook boost',
      channel: CampaignChannel.EMAIL,
      status: 'sent',
      content: { template: 'rebook', variant: 'A' },
      filters: { segment: 'lapsed-90' }
    }
  });

  await prisma.campaignSend.createMany({
    data: clients.slice(0, 10).map((client) => ({
      campaignId: campaign.id,
      clientId: client.id,
      status: 'delivered',
      metrics: { opens: 2, clicks: 1 }
    }))
  });

  await Promise.all(
    locations.map((location) =>
      prisma.cashUp.create({
        data: {
          locationId: location.id,
          date: new Date(),
          openingFloat: 150,
          closingFloat: 200,
          cardTotal: 1200,
          cashTotal: 450,
          notes: 'Auto-generated seed data'
        }
      })
    )
  );

  const invoice = await prisma.invoice.create({
    data: {
      appointmentId: appointments[0]!.id,
      locationId: appointments[0]!.locationId,
      clientId: appointments[0]!.clientId,
      status: 'PAID',
      total: appointments[0]!.totalPrice,
      balance: 0,
      vatAmount: appointments[0]!.totalPrice * 0.2,
      lines: {
        create: appointments[0]!.services.map((service) => ({
          description: service.service.name,
          quantity: 1,
          unitPrice: service.price,
          vatRate: VATRate.STANDARD
        }))
      }
    }
  });

  await prisma.payment.updateMany({
    where: { appointmentId: appointments[0]!.id },
    data: { invoiceId: invoice.id }
  });

  const segment = await prisma.segment.create({
    data: {
      name: 'VIP',
      definition: { minSpend: 500 }
    }
  });

  await prisma.segmentMembership.createMany({
    data: clients.slice(0, 8).map((client) => ({ segmentId: segment.id, clientId: client.id }))
  });

  await prisma.reportSchedule.create({
    data: {
      name: 'Weekly takings',
      reportKey: 'finance-daily',
      frequency: ReportFrequency.WEEKLY,
      recipients: 'owner@elevair.co.uk'
    }
  });

  console.log('Seed data complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
