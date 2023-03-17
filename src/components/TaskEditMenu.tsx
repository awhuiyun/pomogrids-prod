import uuid from "react-uuid";
import useTaskStore from "@/stores/tasks";
import useUserStore from "@/stores/user";
import useToastStore from "@/stores/toast";
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
    tasks,
    taskEditMenuId,
    setTaskEditMenuid,
    toggleTaskFormOpen,
    setSelectedTaskForEdit,
    deleteTask,
    addTask,
    mousePos,
    archiveTask,
    toggleIsTaskEditMenuOpen,
  } = useTaskStore();
  const { addToast } = useToastStore();

  // Variable to store the position of the menu
  const position = {
    top: mousePos.y,
    left: mousePos.x,
  };

  // Function to handle click on Update Task option
  function handleUpdateTaskClick() {
    toggleTaskFormOpen("update");
    setSelectedTaskForEdit(taskEditMenuId);

    // Reset state and close menu
    setTaskEditMenuid("");
    toggleIsTaskEditMenuOpen(false);
  }

  // Function to handle click on Archive Task option
  async function handleArchiveTaskClick() {
    try {
      // Optimistic loading: Archive task in useTaskStore first
      archiveTask(taskEditMenuId, true);

      // Close menu
      toggleIsTaskEditMenuOpen(false);

      // PATCH request: Archive task in tasks table (toggle is_archived = true)
      await archiveTaskService(user, { task_id: taskEditMenuId });

      // Reset
      setTaskEditMenuid("");
    } catch (error) {
      // Rollback changes in useTaskStore
      archiveTask(taskEditMenuId, false);

      // Add toast notification
      addToast({
        uniqueId: uuid(),
        className: "bg-red-50 text-red-700",
        content:
          "Something went wrong with archiving task. Please try again! 😫",
      });

      // Reset
      setTaskEditMenuid("");
    }
  }

  // Function to handle click on Delete Task option
  async function handleDeleteTaskClick() {
    try {
      // Optimistic loading: Delete task in useTaskStore first
      deleteTask(taskEditMenuId);

      // Close menu
      toggleIsTaskEditMenuOpen(false);

      // DELETE request: Delete task from tasks and tasks_session table
      await deleteExistingTaskService(user, { task_id: taskEditMenuId });

      // Reset
      setTaskEditMenuid("");
    } catch (error) {
      // Rollback changes in useTaskStore
      const taskDeleted = tasks.filter((item) => {
        return item.uniqueId === taskEditMenuId;
      })[0];

      addTask({
        uniqueId: taskDeleted.uniqueId,
        taskName: taskDeleted.taskName,
        targetNumOfSessions: taskDeleted.targetNumOfSessions,
        completedNumOfSessions: taskDeleted.completedNumOfSessions,
        category_name: taskDeleted.category_name,
        category_colour: taskDeleted.category_colour,
        isArchived: taskDeleted.isArchived,
        isCompleted: taskDeleted.isCompleted,
        isSelectedForTimer: taskDeleted.isSelectedForTimer,
        isSelectedForEdit: taskDeleted.isSelectedForEdit,
      });

      // Add toast notification
      addToast({
        uniqueId: uuid(),
        className: "bg-red-50 text-red-700",
        content:
          "Something went wrong with deleting task. Please try again! 😫",
      });

      // Reset
      setTaskEditMenuid("");
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
