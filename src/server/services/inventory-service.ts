import { prisma } from '@/server/db/client';
import { z } from 'zod';

export const listLowStock = async (locationId: string, threshold = 5) => {
  return prisma.inventoryProduct.findMany({
    where: {
      locationBins: {
        some: {
          bin: { locationId },
          quantity: { lt: threshold }
        }
      }
    },
    include: {
      locationBins: {
        where: { bin: { locationId } },
        include: { bin: true }
      }
    }
  });
};

const poSchema = z.object({
  locationId: z.string(),
  supplier: z.string(),
  lines: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      costPrice: z.number().min(0)
    })
  )
});

export const createPurchaseOrder = async (input: z.infer<typeof poSchema>) => {
  const data = poSchema.parse(input);
  return prisma.purchaseOrder.create({
    data: {
      locationId: data.locationId,
      supplier: data.supplier,
      status: 'draft',
      lines: {
        create: data.lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          costPrice: line.costPrice
        }))
      }
    },
    include: { lines: { include: { product: true } } }
  });
};
