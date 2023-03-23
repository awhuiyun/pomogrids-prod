import { Response, Request } from "express";
import { prisma } from "@/server/utils/prisma";
import { authenticateJWT } from "@/server/middleware/authenticate";
import { UpdateTaskAfterSessioPayload, ApiResponseError } from "@/types";

export default async function updateTaskAfterSessionHandler(
  req: Request,
  res: Response<string | ApiResponseError>
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const { task_id, number_of_sessions, number_of_minutes } =
      req.body as UpdateTaskAfterSessioPayload;

    // Check if the task has been worked on today
    const today_date = new Date().toISOString();
    const today_year = parseInt(today_date.split("T")[0].split("-")[0]);
    const today_month = parseInt(today_date.split("T")[0].split("-")[1]);
    const today_day = parseInt(today_date.split("T")[0].split("-")[2]);

    const session = await prisma.tasks_session.findUnique({
      where: {
        task_id_year_of_session_month_of_session_day_of_session: {
          task_id: task_id,
          year_of_session: today_year,
          month_of_session: today_month,
          day_of_session: today_day,
        },
      },
    });

    // Task has been worked on today
    if (session) {
      await prisma.tasks_session.update({
        data: {
          task_id: task_id,
          number_of_sessions: session.number_of_sessions + number_of_sessions,
          number_of_minutes: session.number_of_minutes + number_of_minutes,
        },
        where: {
          task_id_year_of_session_month_of_session_day_of_session: {
            task_id: task_id,
            year_of_session: today_year,
            month_of_session: today_month,
            day_of_session: today_day,
          },
        },
      });

      return res.send("Task successfully updated after completed session!");
    } // Task has not been worked on today
    else {
      await prisma.tasks_session.create({
        data: {
          task_id: task_id,
          number_of_sessions: number_of_sessions,
          number_of_minutes: number_of_minutes,
          date_of_session: today_date,
          year_of_session: today_year,
          month_of_session: today_month,
          day_of_session: today_day,
        },
      });

      return res.send("Task successfully updated after completed session!");
    }
  } catch (error) {
    console.error(" PATCH /tasks/update-task-after-session", error);
    return res.status(400).json({
      status: "error",
      message: "request to get update task after session failed",
    });
  }
}
