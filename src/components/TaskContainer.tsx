import TaskItem from "./TaskItem";

export default function TaskContainer() {
  return (
    <div className="border border-slate-900 shadow-custom shadow-slate-900 rounded p-4 pb-8 w-full h-fit space-y-2">
      {/* Title */}
      <p className="text-slate-400 text-xs">Tasks:</p>

      {/* Tasks section */}
      <TaskItem
        uniqueId="1"
        taskName="Build Pomogrids"
        targetNumOfSessions={5}
        completedNumOfSessions={3}
        isCompleted={false}
        isSelectedForTimer={false}
        isSelectedForEdit={false}
      />
      <TaskItem
        uniqueId="2"
        taskName="Buy groceries"
        targetNumOfSessions={1}
        completedNumOfSessions={1}
        isCompleted={true}
        isSelectedForTimer={false}
        isSelectedForEdit={false}
      />

      {/* Add Task */}
      <div className="text-slate-400 cursor-pointer p-1 pt-4">+ Add task</div>
    </div>
  );
}
