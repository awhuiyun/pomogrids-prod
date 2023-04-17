import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useTaskStore from "@/stores/useTaskStore";
import useUserStore from "@/stores/useUserStore";
import useToastStore from "@/stores/useToastStore";
import BaseButton from "../base/BaseButton";
import BaseInput from "../base/BaseInput";
import {
  createNewTaskService,
  updateExistingTaskService,
} from "@/services/tasks";
import BaseFormTitle from "../base/BaseFormTitle";

export default function TaskForm() {
  // Global states: useTaskStore
  const { taskFormType, toggleTaskFormOpen } = useTaskStore();
  const { addTask, deleteTask } = useTaskStore();
  const { tasks, unselectAllTasksForEdit, setEditsToSelectedTaskForEdit } =
    useTaskStore();
  const { addErrorToast } = useToastStore();

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
  function handleTaskNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTaskNameInput(e.target.value);
  }

  function handleTargetNumOfSessionInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setTargetNumOfSessionsInput(parseInt(e.target.value));
  }

  // Function to toggle isTaskFromOpen=False
  function closeTaskForm() {
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
      addErrorToast(
        "Something went wrong with creating task. Please try again! 😫"
      );
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
      addErrorToast(
        "Something went wrong with updating task. Please try again! 😫"
      );
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
      className="backdrop-blur-sm inset-0 bg-slate-700/20 fixed fade-in z-50 px-4"
      onClick={closeTaskForm}
    >
      <form
        className="flex flex-col border border-slate-900 shadow-custom shadow-slate-900 rounded sticky top-28 mx-auto bg-white max-w-[500px] text-slate-900 p-6 space-y-8"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmitClick}
      >
        {/* Form title */}
        <section>
          <BaseFormTitle
            title={taskFormType === "create" ? "Add Task" : "Update Task"}
          />

          {/* Sub-title */}
          {/* Completed number of sessions */}
          {taskFormType === "update" && (
            <p className="text-slate-600 text-center text-sm mt-2">
              {completedNumOfSessionsInput} sessions completed
            </p>
          )}
        </section>

        {/* Task fields */}
        <section className="space-y-6">
          <BaseInput
            label="Name:"
            placeholder="What are you working on today?"
            type="text"
            id="taskName"
            value={taskNameInput}
            onChange={handleTaskNameInputChange}
            required={true}
          />

          <BaseInput
            label="Number of sessions:"
            type="number"
            id="targetNumOfSessionsInput"
            value={targetNumOfSessionsInput}
            onChange={handleTargetNumOfSessionInputChange}
            required={true}
            min={taskFormType === "create" ? 1 : completedNumOfSessionsInput}
          />
        </section>

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
