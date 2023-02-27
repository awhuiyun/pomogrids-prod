import styles from "../styles/TaskEditMenu.module.css";
import useTaskStore from "@/stores/tasks";
import TaskMenuItem from "./TaskMenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default function TaskEditMenu() {
  // Global states: useTaskStore
  const {
    taskEditMenuId,
    setTaskEditMenuid,
    setTaskFormOpenTrue,
    setSelectedTaskForEdit,
    deleteTask,
    mousePos,
  } = useTaskStore();

  // Variable to store the position of the menu
  const position = {
    top: mousePos.y,
    left: mousePos.x,
  };

  // Function to handle click on Update Task option
  function handleUpdateTaskClick() {
    setTaskFormOpenTrue("update");
    setSelectedTaskForEdit(taskEditMenuId);

    // Reset
    setTaskEditMenuid("");
  }

  // Function to handle click on Delete Task option
  function handleDeleteTaskClick() {
    deleteTask(taskEditMenuId);

    // Reset
    setTaskEditMenuid("");
  }

  //   Function to handle click on page to close the Task Edit Menu
  function handleClickToCloseEditMenu() {
    setTaskEditMenuid("");
  }

  return (
    <div className="inset-0 absolute" onClick={handleClickToCloseEditMenu}>
      <div
        className={`w-[150px] border border-slate-200 shadow shadow-slate-400 rounded py-1 my-2 bg-white fixed`}
        style={position}
        onClick={(e) => e.stopPropagation()}
      >
        <div onClick={handleUpdateTaskClick}>
          <TaskMenuItem>
            <FontAwesomeIcon icon={faPen} className="mr-2" />
            Update task
          </TaskMenuItem>
        </div>
        <div onClick={handleDeleteTaskClick}>
          <TaskMenuItem className="text-red-400">
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete task
          </TaskMenuItem>
        </div>
      </div>
    </div>
  );
}
