import { create } from "zustand";

interface IUseUserStore {
  user_id: string;
  email: string;
  setUserId: (id: string) => void;
  setEmail: (email: string) => void;
}

const useUserStore = create<IUseUserStore>((set) => ({
  user_id: "ca00d32a-b740-11ed-8877-0242ac110002",
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
