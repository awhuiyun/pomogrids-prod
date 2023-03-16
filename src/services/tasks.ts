import axios from "axios";
import { User } from "firebase/auth";
import {
  ArchiveTaskPayload,
  CreateNewTaskPayload,
  DeleteExistingTaskPayload,
  GetTaskInYearPayload,
  ITaskInTheYear,
  ITaskItem,
  UpdateExistingTaskPayload,
  UpdateTaskAfterSessioPayload,
} from "@/types/";

// Function to get all tasks in year
export async function getTasksInYearService(
  user: User | null,
  payload: GetTaskInYearPayload
): Promise<ITaskInTheYear[] | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: tasks } = await axios<ITaskInTheYear[]>({
        method: "post",
        url: "/api/tasks/get-tasks-in-year",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: payload,
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
  payload: CreateNewTaskPayload
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);

      const { data: response } = await axios<string>({
        method: "post",
        url: "/api/tasks/create-task",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: payload,
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
  payload: UpdateExistingTaskPayload
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
        method: "patch",
        url: "/api/tasks/update-task",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: payload,
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
  payload: DeleteExistingTaskPayload
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
        method: "delete",
        url: "/api/tasks/delete-task",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: payload,
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
  payload: UpdateTaskAfterSessioPayload
): Promise<string | void> {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const { data: response } = await axios<string>({
        method: "patch",
        url: "/api/tasks/update-task-after-session",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: payload,
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
  payload: ArchiveTaskPayload
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
        data: payload,
      });

      // Testing optimistic loading
      // throw new Error();
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
        method: "get",
        url: "/api/tasks/get-unarchived-tasks",
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
