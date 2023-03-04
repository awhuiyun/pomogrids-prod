import { useState } from "react";
import uuid from "react-uuid";
import useTaskStore from "@/stores/tasks";
import useUserStore from "@/stores/user";
import BaseButton from "./BaseButton";
import {
  createNewTaskService,
  updateExistingTaskService,
} from "@/services/tasks";

export default function TaskForm() {
  // Global states: useTaskStore
  const { taskFormType, toggleTaskFormOpen } = useTaskStore();
  const { addTask } = useTaskStore();
  const { tasks, unselectAllTasksForEdit, setEditsToSelectedTaskForEdit } =
    useTaskStore();

  // Global states: useUserStore
  const { user } = useUserStore();
  // Local states and variables
  const taskSelectedForEdit = tasks.filter((item) => {
    return item.isSelectedForEdit === true;
  })[0];
  console.log(taskFormType, taskSelectedForEdit);
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
  async function createNewTask() {
    try {
      //  Generate uuid
      const uniqueId = uuid();

      // POST request: Create new task in tasks table
      await createNewTaskService(
        user,
        uniqueId,
        taskNameInput,
        targetNumOfSessionsInput
      );

      // Update Global State: Create add new task into useTaskStore
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
    } catch (error) {
      console.log(error);
    }
  }

  // Function to edit existing task
  async function updateExistingTask() {
    try {
      // PATCH request: Update existing task
      await updateExistingTaskService(
        user,
        taskSelectedForEdit.uniqueId,
        taskNameInput,
        targetNumOfSessionsInput
      );

      // Update global states
      setEditsToSelectedTaskForEdit(taskNameInput, targetNumOfSessionsInput);
    } catch (error) {
      console.log(error);
    }
  }

  // Function to handle form submit
  async function handleSubmitClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Conditional: Create new task or Update existing task
    if (taskFormType === "create") {
      await createNewTask();
    } else if (taskFormType === "update") {
      await updateExistingTask();
    }

    // Close modal & reset states
    toggleTaskFormOpenFalse();
  }

  return (
    <div
      className="backdrop-blur-sm inset-0 bg-slate-700/20 absolute fade-in z-50"
      onClick={toggleTaskFormOpenFalse}
    >
      <form
        className="flex flex-col rounded-md sticky top-28 mx-auto bg-white w-[500px] text-slate-90 p-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmitClick}
      >
        {/* Form title */}
        <p className="font-bold text-xl text-center">
          {taskFormType === "create" ? "Create new task" : "Update task"}
        </p>

        {/* Task Name */}
        <label>
          Task name:
          <input
            type="text"
            id="taskName"
            placeholder="What are you working on today?"
            value={taskNameInput}
            className="mx-2 focus:outline-0 w-[300px]"
            onChange={handleInputChange}
            required
          />
        </label>

        {/* Target number of sessions */}
        <label>
          Target number of sessions:
          <input
            type="number"
            id="targetNumOfSessionsInput"
            value={targetNumOfSessionsInput}
            min={taskFormType === "create" ? 1 : completedNumOfSessionsInput}
            className="mx-2 focus:outline-0 w-[60px]"
            onChange={handleInputChange}
            required
          />
        </label>

        {/* Completed number of sessions */}
        {taskFormType === "update" && (
          <label>
            Completed number of sessions:
            <input
              type="number"
              id="completedNumOfSessionsInput"
              value={completedNumOfSessionsInput}
              className="mx-2 focus:outline-0 w-[60px]"
              disabled
            />
          </label>
        )}

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
