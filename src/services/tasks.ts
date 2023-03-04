// require("dotenv").config();
import axios from "axios";
import { getCurrentUser } from "@/auth/functions";
import { User } from "firebase/auth";

// Function to create new task in tasks table
export async function createNewTaskService(
  user: User | null,
  task_id: string,
  task_name: string,
  target_num_of_sessions: number,
  category_name?: string,
  category_colour?: string
) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const result = await axios({
        method: "post",
        url: "http://127.0.0.1:5001/tasks/create",
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
      console.log(result.data);
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
) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const result = await axios({
        method: "patch",
        url: "http://127.0.0.1:5001/tasks/update",
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
      console.log(result.data);
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
) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const result = await axios({
        method: "delete",
        url: "http://127.0.0.1:5001/tasks/delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          task_id,
        },
      });
      console.log(result.data);
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
) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const result = await axios({
        method: "patch",
        url: "http://127.0.0.1:5001/tasks/session-complete",
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
      console.log(result.data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to archive task
export async function archiveTaskService(user: User | null, task_id: string) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const result = await axios({
        method: "patch",
        url: "http://127.0.0.1:5001/tasks/archive-task",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
        data: {
          task_id,
        },
      });
      console.log(result.data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to retrieve all unarchived tasks to populate TaskContainer
export async function getUnarchivedTasksService<T>(user: User | null) {
  try {
    if (user) {
      const firebaseUserIdToken = await user.getIdToken(true);
      const result = await axios<T[]>({
        method: "post",
        url: "http://127.0.0.1:5001/tasks/unarchived-tasks",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + firebaseUserIdToken,
        },
      });
      console.log("working");
      return result.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
