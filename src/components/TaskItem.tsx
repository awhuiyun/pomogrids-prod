import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { ITaskItem } from "@/types/interfaces";

export default function TaskItem({
  taskName,
  targetNumOfSessions,
  completedNumOfSessions,
  isCompleted,
}: ITaskItem) {
  return (
    <div className="text-slate-900 p-1 flex space-x-2 hover:bg-slate-50 place-items-center cursor-pointer">
      {/* Grip Icon */}
      <FontAwesomeIcon
        icon={faGripVertical}
        className="text-slate-400 hover:text-slate-900 "
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
