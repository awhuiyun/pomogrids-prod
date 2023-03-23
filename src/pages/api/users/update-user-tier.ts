import { Response, Request } from "express";
import { prisma } from "@/server/utils/prisma";
import { authenticateJWT } from "@/server/middleware/authenticate";
import { ApiResponseError, IUserTier } from "@/types";

export default async function updateUserTierHandler(
  req: Request,
  res: Response<String | ApiResponseError>
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const { tier } = req.body as IUserTier;

    // Prisma query
    await prisma.user.update({
      data: {
        tier: tier,
      },
      where: {
        id: uid,
      },
    });

    return res.send("Successfully updated user tier!");
  } catch (error) {
    console.error(" PATCH /users/update-user-tier", error);
    return res.status(400).json({
      status: "error",
      message: "request to update user tier failed",
    });
  }
}
