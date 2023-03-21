import { stripe } from "@/server/stripe";
import { createOrRetrieveCustomer } from "@/server/middleware/payments";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  CreateCheckoutSessionPayload,
  CreateCheckoutSessionResponse,
} from "@/types";

export default async function createCheckoutSessionHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCheckoutSessionResponse>
) {
  try {
    const { priceId, profileId } = req.body as CreateCheckoutSessionPayload;

    const { customerId, currentSubscriptionStatus } =
      await createOrRetrieveCustomer(profileId);

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      mode: "subscription",
      success_url: `${req.headers.origin}/get-premium/success`,
      cancel_url: `${req.headers.origin}/get-premium`,
    });

    if (!session.url) throw new Error("Something went wrong...");

    res.status(200).json({
      sessionUrl: session.url,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ sessionUrl: "" });
  }
}
