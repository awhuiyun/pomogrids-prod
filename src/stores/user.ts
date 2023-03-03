import { create } from "zustand";

interface IUseUserStore {
  user_id: string;
  email: string;
  setUserId: (id: string) => void;
  setEmail: (email: string) => void;
}

const useUserStore = create<IUseUserStore>((set) => ({
  user_id: "",
  email: "",
  setUserId: (id: string) =>
    set(() => ({
      user_id: id,
    })),
  setEmail: (email: string) =>
    set(() => ({
      email: email,
    })),
}));

export default useUserStore;
