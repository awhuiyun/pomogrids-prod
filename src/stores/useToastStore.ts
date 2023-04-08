import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { IToastItem } from "@/types/toasts.types";

interface IToastStore {
  isToastContainerOpen: boolean;
  toasts: IToastItem[];
  addSuccessToast: (content: string) => void;
  addErrorToast: (content: string) => void;
  deleteToast: (id: string) => void;
}

const useToastStore = create<IToastStore>((set) => ({
  isToastContainerOpen: false,
  toasts: [],
  addSuccessToast: (content: string) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          uniqueId: uuidv4(),
          className: "bg-green-50 text-green-700",
          content: content,
        },
      ],
    })),
  addErrorToast: (content: string) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          uniqueId: uuidv4(),
          className: "bg-red-50 text-red-700",
          content: content,
        },
      ],
    })),
  deleteToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((item) => {
        return item.uniqueId !== id;
      }),
    })),
}));

export default useToastStore;
