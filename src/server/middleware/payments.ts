import { prisma } from "@/server/prisma/prismaClient";
import { stripe } from "../stripe";

export async function createOrRetrieveCustomer(profileId: string) {
  const profile = await prisma.user.findUnique({
    where: {
      id: profileId,
    },
    select: {
      stripeSubscriptionStatus: true,
      stripeCustomerId: true,
      email: true,
    },
  });

  // retrieve customer
  if (profile?.stripeCustomerId) {
    return {
      currentSubscriptionStatus: profile.stripeSubscriptionStatus,
      customerId: profile.stripeCustomerId,
    };
  }

  // create stripe customer
  const customer = await stripe.customers.create({
    metadata: {
      profileId,
    },
    email: profile?.email,
  });

  await prisma.user.update({
    where: {
      id: profileId,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return {
    currentSubscriptionStatus: profile?.stripeSubscriptionStatus, // always null
    customerId: customer.id,
  };
}
