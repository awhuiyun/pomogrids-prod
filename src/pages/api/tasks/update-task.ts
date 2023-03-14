import { Response, Request } from "express";
import { prisma } from "@/server/prisma/prismaClient";
import { authenticateJWT } from "@/server/middleware/authenticate";

type UpdateExistingTaskPayload = {
  task_id: string;
  task_name: string;
  target_num_of_sessions: number;
  category_name?: string;
  category_colour?: string;
};

export default async function updateExistingTaskHandler(
  req: Request,
  res: Response
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const {
      task_id,
      task_name,
      target_num_of_sessions,
      category_name,
      category_colour,
    } = req.body as UpdateExistingTaskPayload;

    // Prisma query
    const task = await prisma.task.update({
      data: {
        task_name: task_name,
        target_num_of_sessions: target_num_of_sessions,
        category_name: category_name,
        category_colour: category_colour,
      },
      where: {
        id: task_id,
      },
    });

    return res.send("Existing task successfully updated!");
  } catch (error) {
    console.error(" PATCH /tasks/update-task", error);
    return res.status(400).json({
      status: "error",
      message: "request to get update existing task failed",
    });
  }
}
