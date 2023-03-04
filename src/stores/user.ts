import { create } from "zustand";
import { User } from "firebase/auth";

interface IUseUserStore {
  user: User | null;
  user_id: string;
  email: string;
  setUser: (user: User | null) => void;
  setUserId: (id: string) => void;
  setEmail: (email: string) => void;
}

const useUserStore = create<IUseUserStore>((set) => ({
  user: null,
  user_id: "",
  email: "",
  setUser: (user: User | null) =>
    set(() => ({
      user: user,
    })),
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
