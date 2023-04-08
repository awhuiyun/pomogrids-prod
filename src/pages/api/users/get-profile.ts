import { Response, Request } from "express";
import { prisma } from "@/server/utils/prisma";
import { authenticateJWT } from "@/server/middleware/authenticate";

export default async function getProfileHandler(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const { uid } = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    // Prisma query
    const profile = await prisma.user.findUnique({
      where: {
        id: uid,
      },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
        stripeSubscriptionStatus: true,
      },
    });

    if (!profile) {
      throw new Error();
    }

    return res.send(profile);
  } catch (error) {
    console.error(" POST /settings/get-settings", error);
    return res.status(400).json({
      status: "error",
      message: "request to get settings failed",
    });
  }
}
