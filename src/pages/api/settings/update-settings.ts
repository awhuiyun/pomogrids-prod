import { Response, Request } from "express";
import { prisma } from "@/server/prisma/prismaClient";
import { authenticateJWT } from "@/server/middleware/authenticate";

type UpdateSettingsPayload = {
  pomodoro_minutes: number;
  short_break_minutes: number;
  long_break_minutes: number;
  number_of_sessions_in_a_cycle: number;
  alarm_ringtone: string;
  alarm_volume: number;
  week_start: string;
};

export default async function updateSettingsHandler(
  req: Request,
  res: Response
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const {
      pomodoro_minutes,
      short_break_minutes,
      long_break_minutes,
      number_of_sessions_in_a_cycle,
      alarm_ringtone,
      alarm_volume,
      week_start,
    } = req.body as UpdateSettingsPayload;

    // Prisma query: Check for user's tier
    const tier = await prisma.user.findUnique({
      where: {
        id: uid,
      },
      select: {
        tier: true,
      },
    });

    // If user is premium:
    if (tier?.tier === "premium") {
      // Prisma query: Update settings
      await prisma.settings.update({
        data: {
          pomodoro_minutes: pomodoro_minutes,
          short_break_minutes: short_break_minutes,
          long_break_minutes: long_break_minutes,
          number_of_sessions_in_a_cycle: number_of_sessions_in_a_cycle,
          alarm_ringtone: alarm_ringtone,
          alarm_volume: alarm_volume,
          week_start: week_start,
        },
        where: {
          user_id: uid,
        },
      });

      return res.send("Settings successfully updated!");
    } // If user is not premium
    else {
      return res.send("Not authorized");
    }
  } catch (error) {
    console.error(" PATCH /settings/update-settings", error);
    return res.status(400).json({
      status: "error",
      message: "request to update settings failed",
    });
  }
}
