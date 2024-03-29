import { Response, Request } from "express";
import { prisma } from "@/server/prisma/prismaClient";
import { authenticateJWT } from "@/server/middleware/authenticate";
import { Settings } from "@prisma/client";
import { ApiResponseError } from "@/types";

export default async function getSettingsHandler(
  req: Request,
  res: Response<Settings | ApiResponseError>
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;

    // Prisma query
    const settings = await prisma.settings.findUnique({
      where: {
        user_id: uid,
      },
    });

    if (!settings) {
      throw new Error("User does not have settings");
    }

    return res.send(settings);
  } catch (error) {
    console.error(" POST /settings/get-settings", error);
    return res.status(400).json({
      status: "error",
      message: "request to get settings failed",
    });
  }
}
