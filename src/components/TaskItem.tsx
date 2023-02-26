import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { ITaskItem } from "@/types/interfaces";
import useTaskStore from "@/stores/tasks";

export default function TaskItem({
  uniqueId,
  taskName,
  targetNumOfSessions,
  completedNumOfSessions,
  isCompleted,
}: ITaskItem) {
  // Global states: useTaskStore
  const { setTaskEditMenuid, setMousePos } = useTaskStore();

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
    setTaskEditMenuid(uniqueId);
    setMousePos(mousePosLocal.x, mousePosLocal.y);
  }

  return (
    <div className="text-slate-900 p-1 flex space-x-2 hover:bg-slate-50 place-items-center cursor-pointer">
      {/* Grip Icon */}
      <FontAwesomeIcon
        icon={faGripVertical}
        className="text-slate-400 hover:text-slate-900 "
        onClick={handleGripIconClick}
      />

      {/* Task */}
      <p className={`flex-grow ${isCompleted && "text-slate-400"}`}>
        {taskName}
      </p>

      {/* Pomodoro session counter */}
      <p className="text-slate-400">
        {completedNumOfSessions}/{targetNumOfSessions}
      </p>

      {/* Checkbox Icon */}
      {isCompleted ? (
        <FontAwesomeIcon icon={faSquareCheck} className="text-slate-400" />
      ) : (
        <FontAwesomeIcon icon={faSquare} className="text-slate-400" />
      )}
    </div>
  );
}
