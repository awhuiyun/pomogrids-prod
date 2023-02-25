import { useState } from "react";
import uuid from "react-uuid";
import useTaskStore from "@/stores/tasks";
import BaseButton from "./BaseButton";

export default function TaskForm() {
  // Global states: useTaskStore
  const { setTaskFormOpenFalse, addTask } = useTaskStore();

  // Local states
  const [taskNameInput, setTaskNameInput] = useState("");
  const [targetNumOfSessionsInput, setTargetNumOfSessionsInput] = useState(1);

  // Function to toggle isTaskFromOpen=False
  function toggleTaskFormOpenFalse() {
    setTaskFormOpenFalse();
  }

  // Function to handle input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "taskName") {
      setTaskNameInput(e.target.value);
    } else {
      setTargetNumOfSessionsInput(parseInt(e.target.value));
    }
  }

  // Function to handle form submit
  function handleSubmitClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Create unique key for new task
    const uniqueId = uuid();

    // Create add new task into useTaskStore
    addTask({
      uniqueId: uniqueId,
      taskName: taskNameInput,
      targetNumOfSessions: targetNumOfSessionsInput,
      completedNumOfSessions: 0,
      isCompleted: false,
      isSelectedForTimer: false,
      isSelectedForEdit: false,
    });
    // Close Add Task section
    setTaskFormOpenFalse();
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
        <p className="font-bold text-xl text-center">Create new task</p>

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
            min="1"
            className="mx-2 focus:outline-0 w-[60px]"
            onChange={handleInputChange}
            required
          />
        </label>

        {/* Button */}
        <BaseButton
          type="submit"
          label="Add task"
          className="text-white bg-blue4 px-4 py-1 w-fit mx-auto"
        />
      </form>
    </div>
  );
}
