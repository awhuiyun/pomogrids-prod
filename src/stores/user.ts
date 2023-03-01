import { create } from "zustand";

interface IUseUserStore {
  user_id: string;
}

const useUserStore = create<IUseUserStore>((set) => ({
  user_id: "ca00d32a-b740-11ed-8877-0242ac110002",
}));

export default useUserStore;
