import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/server/db/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2023-10-16'
});

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const payload = await request.text();
  if (!signature) {
    return new Response('missing signature', { status: 400 });
  }
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_placeholder');
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      await prisma.payment.updateMany({
        where: { metadata: { path: ['stripePaymentIntentId'], equals: intent.id } },
        data: { status: 'CAPTURED' }
      });
    }
    return new Response('ok');
  } catch (error) {
    console.error(error);
    return new Response('invalid signature', { status: 400 });
  }
}
