import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "@/server/utils/stripe";
import { prisma } from "@/server/utils/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig,
      process.env.STRIPE_WH_SECRET as string
    );
  } catch (err) {
    const { message } = err as Stripe.errors.StripeSignatureVerificationError;
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Do nothing for now...
      break;
    case "customer.subscription.created":
    case "customer.subscription.deleted":
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer;

      const profile = await prisma.user.findFirst({
        where: {
          stripeCustomerId: customerId as string,
        },
      });

      if (profile) {
        await prisma.user.update({
          where: {
            id: profile.id,
          },
          data: {
            stripeSubscriptionStatus: subscription.status,
          },
        });
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({});
}
