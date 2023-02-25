import useTaskStore from "@/stores/tasks";
import TaskItem from "./TaskItem";

export default function TaskContainer() {
  // Global states: useTaskStore
  const { tasks, setTaskFormOpenTrue } = useTaskStore();

  // Function to toggle isTaskFromOpen=True
  function toggleTaskFormOpenTrue() {
    setTaskFormOpenTrue("add");
  }

  return (
    <div className="border border-slate-900 shadow-custom shadow-slate-900 rounded p-4 pb-8 w-full h-fit space-y-2">
      {/* Title */}
      <p className="text-slate-400 text-xs">Tasks:</p>

      {/* Tasks section */}
      {tasks.map((item) => {
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
