import useTaskStore from "@/stores/useTaskStore";
import TaskItem from "./TaskItem";

export default function TaskContainer() {
  // Global states: useTaskStore
  const { tasks, toggleTaskFormOpen } = useTaskStore();

  // Filter to tasks that are not archived
  const unarchivedTasks = tasks.filter((item) => {
    return item.isArchived === false;
  });

  // Function to toggle isTaskFromOpen=True
  function toggleTaskFormOpenTrue() {
    toggleTaskFormOpen("create");
  }

  return (
    <div className="border border-slate-900 shadow-custom rounded p-4 pb-8 h-fit w-full space-y-2">
      {/* Title */}
      <p className="text-slate-400 text-xs">Tasks:</p>

      {/* Tasks section */}
      {unarchivedTasks.map((item) => {
        return <TaskItem key={item.uniqueId} {...item} />;
      })}

      {/* Add Task */}
      <div
        className="text-slate-400 cursor-pointer p-1 pt-4"
        onClick={toggleTaskFormOpenTrue}
      >
        + Add task
      </div>
    </div>
  );
}
