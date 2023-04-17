import { Response, Request } from "express";
import { prisma } from "@/server/utils/prisma";
import { authenticateJWT } from "@/server/middleware/authenticate";
import { ApiResponseError, DeleteExistingTaskPayload } from "@/types";

export default async function deleteExistingTaskHandler(
  req: Request,
  res: Response<string | ApiResponseError>
) {
  try {
    // Authenticate jwt
    await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const { task_id } = req.body as DeleteExistingTaskPayload;

    // Prisma query: Delete task from tasks_session table
    await prisma.tasks_session.deleteMany({
      where: {
        task_id: task_id,
      },
    });

    //  Prisma query: Delete task from task table
    await prisma.task.delete({
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
