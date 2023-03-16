import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { ITaskItem } from "@/types/";
import useTaskStore from "@/stores/tasks";

export default function TaskItem({
  uniqueId,
  taskName,
  targetNumOfSessions,
  completedNumOfSessions,
  isCompleted,
  isSelectedForTimer,
}: ITaskItem) {
  // Global states: useTaskStore
  const {
    setTaskEditMenuid,
    setMousePos,
    setSelectedTaskForTimer,
    unselectAllTasksForTimer,
    toggleIsTaskEditMenuOpen,
  } = useTaskStore();

  // Local states
  const [mousePosLocal, setMousePosLocal] = useState({ x: 0, y: 0 });

  // Tracks mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePosLocal({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Function to handle click on Grip Icon
  function handleGripIconClick() {
    toggleIsTaskEditMenuOpen(true);
    setTaskEditMenuid(uniqueId);
    setMousePos(mousePosLocal.x, mousePosLocal.y);
  }

  // Function to handle click on task to select it for session
  function handleTaskClick() {
    unselectAllTasksForTimer();
    setSelectedTaskForTimer(uniqueId);
  }

  return (
    <div
      className={`text-slate-900 p-1 flex space-x-2  place-items-center cursor-pointer rounded ${
        isSelectedForTimer ? " bg-slate-200" : "hover:bg-slate-50"
      }`}
    >
      {/* Grip Icon */}
      <FontAwesomeIcon
        icon={faGripVertical}
        className="text-slate-400 hover:text-slate-900 "
        onClick={handleGripIconClick}
      />

      {/* Task */}
      <p
        className={`flex-grow ${isCompleted && "text-slate-400"}`}
        onClick={handleTaskClick}
      >
        {taskName}
      </p>

      {/* Pomodoro session counter */}
      <p
        className={isCompleted ? "text-slate-400" : "text-slate-900"}
        onClick={handleTaskClick}
      >
        {completedNumOfSessions}/{targetNumOfSessions}
      </p>

      {/* Checkbox Icon */}
      {/* {isCompleted ? (
        <FontAwesomeIcon
          icon={faSquareCheck}
          className="text-emerald-400"
          onClick={handleTaskClick}
        />
      ) : (
        <FontAwesomeIcon
          icon={faSquare}
          className="text-slate-400"
          onClick={handleTaskClick}
        />
      )} */}
    </div>
  );
}
