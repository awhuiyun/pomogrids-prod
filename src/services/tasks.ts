import axios from "axios";
import { User } from "firebase/auth";
import { ITaskInTheYear, ITaskItem } from "@/types/";

// Function to get all tasks in year
export async function getTasksInYearService(
  user: User | null,
  year: number
): Promise<ITaskInTheYear[] | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: tasks } = await axios<ITaskInTheYear[]>({
        method: "post",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/tasks/get-tasks-by-year",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          year,
        },
      });

      return tasks;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to create new task in tasks table
export async function createNewTaskService(
  user: User | null,
  task_id: string,
  task_name: string,
  target_num_of_sessions: number,
  category_name?: string,
  category_colour?: string
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: response } = await axios<string>({
        method: "post",
        url: "/api/tasks/create",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          task_id,
          task_name,
          target_num_of_sessions,
          category_name,
          category_colour,
        },
      });

      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to update existing task in tasks table
export async function updateExistingTaskService(
  user: User | null,
  task_id: string,
  task_name: string,
  target_num_of_sessions: number,
  category_name?: string,
  category_colour?: string
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
        method: "patch",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/tasks/update",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          task_id,
          task_name,
          target_num_of_sessions,
          category_name,
          category_colour,
        },
      });

      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to delete existing task
export async function deleteExistingTaskService(
  user: User | null,
  task_id: string
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
        method: "delete",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/tasks/delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          task_id,
        },
      });

      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to update task after session completes
export async function updateTaskAfterSessionService(
  user: User | null,
  task_id: string,
  number_of_sessions: number,
  number_of_minutes: number
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
        method: "patch",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/tasks/session-complete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          task_id,
          number_of_sessions,
          number_of_minutes,
        },
      });

      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to archive task
export async function archiveTaskService(
  user: User | null,
  task_id: string
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
        method: "patch",
        url: "/api/tasks/archive-task",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          task_id,
        },
      });

      return response;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to retrieve all unarchived tasks to populate TaskContainer
export async function getUnarchivedTasksService(
  user: User | null
): Promise<ITaskItem[] | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: tasks } = await axios<ITaskItem[]>({
        method: "post",
        url: process.env.NEXT_PUBLIC_SERVER_URL + "/tasks/unarchived-tasks",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });

      return tasks;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
