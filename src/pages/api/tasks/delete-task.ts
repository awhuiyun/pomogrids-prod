import { Response, Request } from "express";
import { prisma } from "@/server/prisma/prismaClient";
import { authenticateJWT } from "@/server/middleware/authenticate";

type DeleteExistingTaskPayload = {
  task_id: string;
};

export default async function deleteExistingTaskHandler(
  req: Request,
  res: Response
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const { task_id } = req.body as DeleteExistingTaskPayload;

    // Prisma query
    const task = await prisma.task.delete({
      where: {
        id: task_id,
      },
    });

    return res.send("Task successfully deleted!");
  } catch (error) {
    console.error(" DELETE /tasks/delete-task", error);
    return res.status(400).json({
      status: "error",
      message: "request to get delete task failed",
    });
  }
}
