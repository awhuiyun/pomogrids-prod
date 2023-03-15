import { Response, Request } from "express";
import { prisma } from "@/server/prisma/prismaClient";
import { authenticateJWT } from "@/server/middleware/authenticate";
import { ApiResponseError, ITaskItem } from "@/types";

export default async function getUnarchivedTasksHandler(
  req: Request,
  res: Response<ITaskItem[] | ApiResponseError>
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;

    // Prisma query: Return all unarchived tasks
    const unarchivedTasks = await prisma.task.findMany({
      where: {
        user_id: uid,
        is_archived: false,
      },
      select: {
        id: true,
        task_name: true,
        target_num_of_sessions: true,
        category_name: true,
        category_colour: true,
        is_archived: true,
        sessions: {
          select: {
            date_of_session: true,
            number_of_sessions: true,
          },
        },
      },
    });

    // Manipulate result
    const edited_unarchivedTasks = [];

    for (let i = 0; i < unarchivedTasks.length; i++) {
      const task = unarchivedTasks[i];

      const edited_item = {
        uniqueId: task.id,
        taskName: task.task_name,
        targetNumOfSessions: task.target_num_of_sessions,
        completedNumOfSessions: 0,
        category_name: task.category_name,
        category_colour: task.category_colour,
        isArchived: false,
        isCompleted: false,
        isSelectedForTimer: false,
        isSelectedForEdit: false,
      };

      // Update completedNumOfSessions field:
      if (task.sessions.length > 0) {
        for (let j = 0; j < task.sessions.length; j++) {
          edited_item.completedNumOfSessions +=
            task.sessions[j].number_of_sessions;
        }
      }

      // Update isCompleted field:
      if (
        edited_item.completedNumOfSessions >= edited_item.targetNumOfSessions
      ) {
        edited_item.isCompleted = true;
      }

      edited_unarchivedTasks.push(edited_item);
    }

    res.send(edited_unarchivedTasks);
  } catch (error) {
    console.error(" GET /tasks/get-unarchived-tasks", error);
    return res.status(400).json({
      status: "error",
      message: "request to get unarchived tasks failed",
    });
  }
}
