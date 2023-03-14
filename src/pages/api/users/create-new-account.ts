import { Response, Request } from "express";
import { prisma } from "@/server/prisma/prismaClient";
import { authenticateJWT } from "@/server/middleware/authenticate";

export default async function createNewUserHandler(
  req: Request,
  res: Response
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const email = decodedToken.email ?? "";

    // Prisma query: Check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });

    // If user already exists, do nothing
    if (user) {
      return res.send("User account already exists!");
    }

    // If user does not exist, create new account for user
    // Create a new record in User and Settings table
    await prisma.user.create({
      data: {
        id: uid,
        email: email,
        tier: "basic",
        settings: {
          create: {
            pomodoro_minutes: 25,
            short_break_minutes: 5,
            long_break_minutes: 15,
            number_of_sessions_in_a_cycle: 4,
            alarm_ringtone: "buzzer",
            alarm_volume: 0.5,
            week_start: "sunday",
          },
        },
      },
    });

    res.send("New user successfully created!");
  } catch (error) {
    console.error(" PATCH /users/create-new-account", error);
    return res.status(400).json({
      status: "error",
      message: "request to get create new account failed",
    });
  }
}
