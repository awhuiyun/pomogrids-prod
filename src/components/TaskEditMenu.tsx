import TaskMenuItem from "./TaskMenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default function TaskEditMenu() {
  return (
    <div className="w-[150px] border border-slate-200 shadow shadow-slate-400 rounded py-1 my-2">
      <TaskMenuItem>
        <FontAwesomeIcon icon={faPen} className="mr-2" />
        Update task
      </TaskMenuItem>
      <TaskMenuItem className="text-red-400">
        <FontAwesomeIcon icon={faTrash} className="mr-2" />
        Delete task
      </TaskMenuItem>
    </div>
  );
}
