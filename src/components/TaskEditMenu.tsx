import useTaskStore from "@/stores/tasks";
import useUserStore from "@/stores/user";
import TaskMenuItem from "./TaskMenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import {
  deleteExistingTaskService,
  archiveTaskService,
} from "@/services/tasks";

export default function TaskEditMenu() {
  // Global states: useUserStore
  const { user } = useUserStore();

  // Global states: useTaskStore
  const {
    taskEditMenuId,
    setTaskEditMenuid,
    toggleTaskFormOpen,
    setSelectedTaskForEdit,
    deleteTask,
    mousePos,
    archiveTask,
  } = useTaskStore();

  // Variable to store the position of the menu
  const position = {
    top: mousePos.y,
    left: mousePos.x,
  };

  // Function to handle click on Update Task option
  function handleUpdateTaskClick() {
    toggleTaskFormOpen("update");
    setSelectedTaskForEdit(taskEditMenuId);

    // Reset
    setTaskEditMenuid("");
  }

  // Function to handle click on Archive Task option
  async function handleArchiveTaskClick() {
    try {
      // PATCH request: Archive task in tasks table (toggle is_archived = true)
      await archiveTaskService(user, { task_id: taskEditMenuId });

      // Archive task in useTaskStore
      archiveTask(taskEditMenuId);

      // Reset
      setTaskEditMenuid("");
    } catch (error) {
      console.log(error);
    }
  }

  // Function to handle click on Delete Task option
  async function handleDeleteTaskClick() {
    try {
      // DELETE request: Delete task from tasks and tasks_session table
      await deleteExistingTaskService(user, { task_id: taskEditMenuId });

      // Delete task in useTaskStore
      deleteTask(taskEditMenuId);

      // Reset
      setTaskEditMenuid("");
    } catch (error) {
      console.log(error);
    }
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
        <div onClick={handleArchiveTaskClick}>
          <TaskMenuItem>
            <FontAwesomeIcon icon={faFolder} className="mr-2" />
            Archive task
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
