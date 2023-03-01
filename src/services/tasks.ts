// require("dotenv").config();
import axios from "axios";

// Function to create new task in tasks table
export async function createNewTaskService(
  user_id: string,
  task_name: string,
  target_num_of_sessions: number,
  completed_num_of_sessions: number,
  is_completed: boolean,
  category_name?: string,
  category_colour?: string
) {
  try {
    const result = await axios({
      method: "post",
      url: "http://127.0.0.1:5001/tasks/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        user_id,
        task_name,
        target_num_of_sessions,
        completed_num_of_sessions,
        is_completed,
        category_name,
        category_colour,
      },
    });
    console.log(result.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to update existing task in tasks table
export async function updateExistingTaskService(
  user_id: string,
  task_id: string,
  task_name: string,
  target_num_of_sessions: number,
  is_completed: boolean,
  category_name?: string,
  category_colour?: string
) {
  try {
    const result = await axios({
      method: "patch",
      url: "http://127.0.0.1:5001/tasks/update",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        user_id,
        task_id,
        task_name,
        target_num_of_sessions,
        is_completed,
        category_name,
        category_colour,
      },
    });
    console.log(result.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
