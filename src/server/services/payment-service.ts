import Stripe from 'stripe';
import { prisma } from '@/server/db/client';
import { z } from 'zod';

const stripeSecret = process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder';

const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

const paymentIntentSchema = z.object({
  appointmentId: z.string().optional(),
  locationId: z.string(),
  amount: z.number().positive(),
  capture: z.boolean().default(true),
  paymentMethodTypes: z.array(z.string()).default(['card'])
});

export const createPaymentIntent = async (input: z.infer<typeof paymentIntentSchema>) => {
  const data = paymentIntentSchema.parse(input);
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(data.amount * 100),
    currency: 'gbp',
    capture_method: data.capture ? 'automatic' : 'manual',
    payment_method_types: data.paymentMethodTypes,
    metadata: {
      appointmentId: data.appointmentId ?? '',
      locationId: data.locationId
    }
  });

  await prisma.payment.create({
    data: {
      appointmentId: data.appointmentId,
      locationId: data.locationId,
      method: data.paymentMethodTypes.includes('card') ? 'STRIPE_CARD' : 'STRIPE_WALLET',
      status: 'AUTHORIZED',
      amount: data.amount,
      metadata: { stripePaymentIntentId: intent.id }
    }
  });

  return intent;
};
