import { create } from "zustand";
import { User } from "firebase/auth";
import { Profile } from "@/types";
import { profileIsPremium } from "@/utils";

interface IUseUserStore {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  getPremiumStatus: () => boolean;
}

const useUserStore = create<IUseUserStore>((set, get) => ({
  user: null,
  profile: null,
  setUser: (user: User | null) =>
    set(() => ({
      user: user,
    })),
  setProfile: (profile: Profile | null) =>
    set(() => ({
      profile: profile,
    })),
  getPremiumStatus: () =>
    profileIsPremium(get().profile?.stripeSubscriptionStatus),
}));

export default useUserStore;
