import { create } from "zustand";
import { ITaskInTheYear } from "@/types/interfaces";

interface IUseGridStore {
  year: number;
  tasksInTheYear: ITaskInTheYear[];
  setYear: (year: number) => void;
  setTasksInTheYear: (tasks: ITaskInTheYear[]) => void;
}

const useGridStore = create<IUseGridStore>((set) => ({
  year: new Date().getFullYear(),
  tasksInTheYear: [],
  setYear: (year: number) =>
    set(() => ({
      year: year,
    })),
  setTasksInTheYear: (tasks: ITaskInTheYear[]) =>
    set(() => ({
      tasksInTheYear: tasks,
    })),
}));

export default useGridStore;
