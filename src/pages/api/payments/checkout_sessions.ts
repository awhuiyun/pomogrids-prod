const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { Response, Request } from "express";

export default async function handler(req: Request, res: Response) {
  if (req.method === "POST") {
    try {
      // The price ID passed from the client
      const { priceId } = req.body;

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/get-premium/?success=true`,
        cancel_url: `${req.headers.origin}/get-premium/?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
