import { Response, Request } from "express";
import { prisma } from "@/server/prisma/prismaClient";
import { authenticateJWT } from "@/server/middleware/authenticate";
import { ITaskInTheYear } from "@/types/interfaces";

interface GetTaskInYearPayload {
  year: number;
}

export default async function getTasksInYearHandler(
  req: Request,
  res: Response
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const { year } = req.body as GetTaskInYearPayload;

    // Query for result
    const tasks = await prisma.task.findMany({
      where: {
        user_id: uid,
      },
      select: {
        task_name: true,
        category_name: true,
        category_colour: true,
      },
    });
    // Manipulate the result
    //
  } catch (error) {
    console.error(" POST /tasks/get-tasks-by-year", error);
    return res.status(400).json({
      status: "error",
      message: "request to get tasks by year failed",
    });
  }
}
