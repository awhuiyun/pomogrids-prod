import { create } from "zustand";
import { ITaskItem } from "../types/interfaces";

interface IUseTaskStore {
  tasks: ITaskItem[];
  taskFormType: string;
  taskEditMenuId: string;
  mousePos: { x: number; y: number };
  taskSelectedForTimer: string;
  addTask: (task: ITaskItem) => void;
  deleteTask: (id: string) => void;
  setTaskFormOpenTrue: (type: string) => void;
  setTaskFormOpenFalse: () => void;
  setTaskEditMenuid: (id: string) => void;
  setMousePos: (x: number, y: number) => void;
  unselectAllTasksForTimer: () => void;
  setSelectedTaskForTimer: (id: string) => void;
  unselectAllTasksForEdit: () => void;
  setSelectedTaskForEdit: (id: string) => void;
  addSessionCountToTaskAndCheckCompletion: (id: string) => void;
  setEditsToSelectedTaskForEdit: (name: string, sessionNum: number) => void;
}

const useTaskStore = create<IUseTaskStore>((set) => ({
  tasks: [
    {
      uniqueId: "1",
      taskName: "Work on Pomogrids",
      targetNumOfSessions: 5,
      completedNumOfSessions: 3,
      isCompleted: false,
      isSelectedForTimer: false,
      isSelectedForEdit: false,
    },
    {
      uniqueId: "2",
      taskName: "Buy groceries",
      targetNumOfSessions: 1,
      completedNumOfSessions: 1,
      isCompleted: true,
      isSelectedForTimer: false,
      isSelectedForEdit: false,
    },
  ],
  taskFormType: "", // "create", "update", ""; Modal is closed on ""
  taskEditMenuId: "", // uniqueId, ""; Menu is closed on ""
  mousePos: { x: 0, y: 0 },
  taskSelectedForTimer: "",
  addTask: (task: ITaskItem) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  deleteTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.filter((item) => {
        return item.uniqueId !== id;
      }),
    })),
  setTaskFormOpenTrue: (type: string) =>
    set(() => ({
      taskFormType: type,
    })),
  setTaskFormOpenFalse: () =>
    set(() => ({
      taskFormType: "",
    })),
  setTaskEditMenuid: (id: string) =>
    set(() => ({
      taskEditMenuId: id,
    })),
  setMousePos: (posX: number, posY: number) =>
    set(() => ({
      mousePos: { x: posX, y: posY },
    })),
  unselectAllTasksForTimer: () =>
    set((state) => ({
      tasks: state.tasks.map((item) => {
        return { ...item, isSelectedForTimer: false };
      }),
      taskSelectedForTimer: "",
    })),
  setSelectedTaskForTimer: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((item) => {
        if (item.uniqueId === id) {
          return { ...item, isSelectedForTimer: true };
        }
        return item;
      }),
      taskSelectedForTimer: id,
    })),
  unselectAllTasksForEdit: () =>
    set((state) => ({
      tasks: state.tasks.map((item) => {
        return { ...item, isSelectedForEdit: false };
      }),
      taskSelectedForTimer: "",
    })),
  setSelectedTaskForEdit: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((item) => {
        if (item.uniqueId === id) {
          return { ...item, isSelectedForEdit: true };
        }
        return item;
      }),
    })),
  addSessionCountToTaskAndCheckCompletion: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((item) => {
        if (
          item.uniqueId === id &&
          item.targetNumOfSessions - item.completedNumOfSessions !== 1
        ) {
          return {
            ...item,
            numOfCompletedSessions: item.completedNumOfSessions + 1,
          };
        } else if (
          item.uniqueId === id &&
          item.targetNumOfSessions - item.completedNumOfSessions === 1
        ) {
          return {
            ...item,
            numOfCompletedSessions: item.completedNumOfSessions + 1,
            isCompleted: true,
          };
        }
        return item;
      }),
    })),
  setEditsToSelectedTaskForEdit: (name: string, sessionNum: number) =>
    set((state) => ({
      tasks: state.tasks.map((item) => {
        if (item.isSelectedForEdit === true) {
          if (item.completedNumOfSessions >= sessionNum)
            return {
              ...item,
              taskName: name,
              targetNumOfSessions: sessionNum,
              isCompleted: true,
            };
          else {
            return {
              ...item,
              taskName: name,
              targetNumOfSessions: sessionNum,
              isCompleted: false,
            };
          }
        }
        return item;
      }),
    })),
}));

export default useTaskStore;
