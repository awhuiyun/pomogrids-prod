import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useTaskStore from "@/stores/tasks";
import useUserStore from "@/stores/user";
import useToastStore from "@/stores/toast";
import BaseButton from "./BaseButton";
import {
  createNewTaskService,
  updateExistingTaskService,
} from "@/services/tasks";

export default function TaskForm() {
  // Global states: useTaskStore
  const { taskFormType, toggleTaskFormOpen } = useTaskStore();
  const { addTask, deleteTask } = useTaskStore();
  const { tasks, unselectAllTasksForEdit, setEditsToSelectedTaskForEdit } =
    useTaskStore();
  const { addToast } = useToastStore();

  // Global states: useUserStore
  const { user } = useUserStore();
  // Local states and variables
  const taskSelectedForEdit = tasks.filter((item) => {
    return item.isSelectedForEdit === true;
  })[0];
  const originalTaskName =
    taskFormType === "create" ? "" : taskSelectedForEdit.taskName;
  const originalTargetNumOfSessions =
    taskFormType === "create" ? 1 : taskSelectedForEdit.targetNumOfSessions;

  const [taskNameInput, setTaskNameInput] = useState(
    taskFormType === "create" ? "" : taskSelectedForEdit.taskName
  );
  const [targetNumOfSessionsInput, setTargetNumOfSessionsInput] = useState(
    taskFormType === "create" ? 1 : taskSelectedForEdit.targetNumOfSessions
  );
  const completedNumOfSessionsInput =
    taskFormType === "create" ? 0 : taskSelectedForEdit.completedNumOfSessions;

  // Function to handle input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "taskName") {
      setTaskNameInput(e.target.value);
    } else {
      setTargetNumOfSessionsInput(parseInt(e.target.value));
    }
  }

  // Function to toggle isTaskFromOpen=False
  function toggleTaskFormOpenFalse() {
    // Close modal & reset states
    toggleTaskFormOpen("");
    unselectAllTasksForEdit();
  }

  // Function to create new task
  async function createNewTask(uniqueId: string) {
    try {
      // Optimistic loading: Create add new task in useTaskStore first
      addTask({
        uniqueId: uniqueId,
        taskName: taskNameInput,
        targetNumOfSessions: targetNumOfSessionsInput,
        completedNumOfSessions: 0,
        category_name: null,
        category_colour: null,
        isArchived: false,
        isCompleted: false,
        isSelectedForTimer: false,
        isSelectedForEdit: false,
      });

      // Close modal
      toggleTaskFormOpen("");

      // POST request: Create new task in tasks table
      await createNewTaskService(user, {
        task_id: uniqueId,
        task_name: taskNameInput,
        target_num_of_sessions: targetNumOfSessionsInput,
      });
    } catch (error) {
      // Rollback changes in useTaskStore
      deleteTask(uniqueId);

      // Add toast notification
      addToast({
        uniqueId: uuidv4(),
        className: "bg-red-50 text-red-700",
        content:
          "Something went wrong with creating task. Please try again! 😫",
      });
    }
  }

  // Function to edit existing task
  async function updateExistingTask() {
    try {
      // Optimistic loading: Update task in useTaskStore first
      setEditsToSelectedTaskForEdit(taskNameInput, targetNumOfSessionsInput);

      // Close modal
      toggleTaskFormOpen("");

      // PATCH request: Update existing task
      await updateExistingTaskService(user, {
        task_id: taskSelectedForEdit.uniqueId,
        task_name: taskNameInput,
        target_num_of_sessions: targetNumOfSessionsInput,
      });
    } catch (error) {
      // Rollback changes in useTaskStore
      setEditsToSelectedTaskForEdit(
        originalTaskName,
        originalTargetNumOfSessions
      );

      // Add toast notification
      addToast({
        uniqueId: uuidv4(),
        className: "bg-red-50 text-red-700",
        content:
          "Something went wrong with updating task. Please try again! 😫",
      });
    }
  }

  // Function to handle form submit
  async function handleSubmitClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Conditional: Create new task or Update existing task
    if (taskFormType === "create") {
      //  Generate uuid
      const uniqueId = uuidv4();

      await createNewTask(uniqueId);
    } else if (taskFormType === "update") {
      await updateExistingTask();
    }

    // Reset states
    unselectAllTasksForEdit();
  }

  return (
    <div
      className="backdrop-blur-sm inset-0 bg-slate-700/20 fixed fade-in z-50"
      onClick={toggleTaskFormOpenFalse}
    >
      <form
        className="flex flex-col border border-slate-900 shadow-custom shadow-slate-900 rounded sticky top-28 mx-auto bg-white w-[500px] text-slate-900 p-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmitClick}
      >
        {/* Form title */}
        <div className="mb-4">
          <p className="font-bold text-2xl text-center mb-1.5">
            {taskFormType === "create" ? "Add Task" : "Update Task"}
          </p>
          {/* Completed number of sessions */}
          {taskFormType === "update" && (
            <p className="text-slate-600 text-center text-sm">
              {completedNumOfSessionsInput} sessions completed
            </p>
          )}
        </div>

        {/* Task Name */}
        <div className="flex flex-col mb-6">
          <label className="text-sm mb-1">Name:</label>
          <input
            type="text"
            id="taskName"
            placeholder="What are you working on today?"
            value={taskNameInput}
            className="focus:outline-0 border border-slate-900 rounded px-2 py-1"
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Target number of sessions */}
        <div className="flex flex-col mb-6">
          <label className="text-sm mb-1">Number of sessions:</label>
          <input
            type="number"
            id="targetNumOfSessionsInput"
            value={targetNumOfSessionsInput}
            min={taskFormType === "create" ? 1 : completedNumOfSessionsInput}
            className="focus:outline-0 border border-slate-900 rounded px-2 py-1"
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Button */}
        {taskFormType === "create" ? (
          <BaseButton
            type="submit"
            label="Create"
            className="text-white bg-blue4 px-4 py-1 w-fit mx-auto"
          />
        ) : (
          <BaseButton
            type="submit"
            label="Update"
            className="text-white bg-blue4 px-4 py-1 w-fit mx-auto"
          />
        )}
      </form>
    </div>
  );
}
