import { Response, Request } from "express";
import { prisma } from "@/server/utils/prisma";
import { authenticateJWT } from "@/server/middleware/authenticate";
import { ApiResponseError, IUserTier } from "@/types";

export default async function getUserTierHandler(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;

    // Prisma query
    const tier = await prisma.user.findUnique({
      where: {
        id: uid,
      },
      select: {
        tier: true,
      },
    });

    if (!tier) {
      throw new Error();
    }

    return res.send(tier);
  } catch (error) {
    console.error(" POST /settings/get-settings", error);
    return res.status(400).json({
      status: "error",
      message: "request to get settings failed",
    });
  }
}
