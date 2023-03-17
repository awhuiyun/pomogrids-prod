import { create } from "zustand";
import { IToastItem } from "@/types/toasts.types";

interface IToastStore {
  isToastContainerOpen: boolean;
  toasts: IToastItem[];
  addToast: (toast: IToastItem) => void;
  deleteToast: (id: string) => void;
}

const useToastStore = create<IToastStore>((set) => ({
  isToastContainerOpen: false,
  toasts: [],
  addToast: (toast: IToastItem) =>
    set((state) => ({
      toasts: [...state.toasts, toast],
    })),
  deleteToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((item) => {
        return item.uniqueId !== id;
      }),
    })),
}));

export default useToastStore;
