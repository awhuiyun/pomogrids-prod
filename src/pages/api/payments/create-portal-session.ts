import { stripe } from "@/server/utils/stripe";
import { createOrRetrieveCustomer } from "@/server/middleware/payments";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  CreatePortalSessionPayload,
  CreatePortalSessionResponse,
} from "@/types";

export default async function createPortalSessionHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreatePortalSessionResponse>
) {
  try {
    const { profileId } = req.body as CreatePortalSessionPayload;

    const { customerId } = await createOrRetrieveCustomer(profileId);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.origin}/account-settings`,
    });

    if (!portalSession.url) throw new Error("Something went wrong...");

    res.status(200).json({
      sessionUrl: portalSession.url,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ sessionUrl: "" });
  }
}
