import { Response, Request } from "express";
import { prisma } from "@/server/utils/prisma";
import { authenticateJWT } from "@/server/middleware/authenticate";
import {
  ApiResponseError,
  GetTaskInYearPayload,
  ITaskInTheYear,
} from "@/types/";

export default async function getTasksInYearHandler(
  req: Request,
  res: Response<ITaskInTheYear[] | ApiResponseError>
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const { year } = req.body as GetTaskInYearPayload;

    // Prisma query: Return the tasks found in the below date range
    const tasks = await prisma.tasks_session.findMany({
      where: {
        task: {
          user_id: uid,
        },
        OR: [
          // Eg: 01-01-2023 to 31-12-2023 (UTC time)
          { year_of_session: year },
          // Eg: 31-12-2022 (UTC time)
          {
            AND: [
              { year_of_session: year - 1 },
              { month_of_session: 12 },
              { day_of_session: 31 },
            ],
          },
          // Eg: 01-01-2024 (UTC time)
          {
            AND: [
              { year_of_session: year + 1 },
              { month_of_session: 1 },
              { day_of_session: 1 },
            ],
          },
        ],
      },
      select: {
        date_of_session: true,
        number_of_minutes: true,
        task: {
          select: {
            task_name: true,
            category_name: true,
            category_colour: true,
          },
        },
      },
    });

    // Manipulate result
    let edited_tasks = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const edited = {
        dateOfSession: task.date_of_session,
        completedNumOfMinutes: task.number_of_minutes,
        taskName: task.task.task_name,
        category_name: task.task.category_name,
        category_colour: task.task.category_colour,
      };

      edited_tasks.push(edited);
    }

    return res.send(edited_tasks);
  } catch (error) {
    console.error(" POST /tasks/get-tasks-by-year", error);
    return res.status(400).json({
      status: "error",
      message: "request to get tasks by year failed",
    });
  }
}
