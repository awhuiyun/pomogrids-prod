import { Response, Request } from "express";
import { prisma } from "@/server/utils/prisma";
import { authenticateJWT } from "@/server/middleware/authenticate";
import { ApiResponseError, ArchiveTaskPayload } from "@/types";

export default async function archiveTaskHandler(
  req: Request,
  res: Response<string | ApiResponseError>
) {
  try {
    // Authenticate jwt
    await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const { task_id } = req.body as ArchiveTaskPayload;

    // Prisma query
    await prisma.task.update({
      data: {
        is_archived: true,
      },
      where: {
        id: task_id,
      },
    });

    return res.send("Existing task successfully archived!");
  } catch (error) {
    console.error(" PATCH /tasks/archive-task", error);
    return res.status(400).json({
      status: "error",
      message: "request to get archive task failed",
    });
  }
}
