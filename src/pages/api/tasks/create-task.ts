import { Response, Request } from "express";
import { prisma } from "@/server/prisma/prismaClient";
import { authenticateJWT } from "@/server/middleware/authenticate";

type CreateNewTaskPayload = {
  task_id: string;
  task_name: string;
  target_num_of_sessions: number;
  category_name?: string;
  category_colour?: string;
};

export default async function createNewTaskHandler(
  req: Request,
  res: Response
) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const {
      task_id,
      task_name,
      target_num_of_sessions,
      category_name,
      category_colour,
    } = req.body as CreateNewTaskPayload;

    // Prisma query
    const task = await prisma.task.create({
      data: {
        id: task_id,
        task_name: task_name,
        target_num_of_sessions: target_num_of_sessions,
        is_archived: false,
        category_name: category_name,
        category_colour: category_colour,
        user_id: uid,
      },
    });

    return res.send("New task successfully created!");
  } catch (error) {
    console.error(" POST /tasks/create-task", error);
    return res.status(400).json({
      status: "error",
      message: "request to get create new task failed",
    });
  }
}
