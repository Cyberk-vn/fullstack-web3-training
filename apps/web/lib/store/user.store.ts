import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "../types/profile";

interface UserState {
  jwt: string | null;
  profile: Profile | null;
  setJwt: (jwt: string | null) => void;
  setProfile: (profile: Profile | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      jwt: null,
      profile: null,
      setJwt: jwt => set({ jwt }),
      setProfile: profile => set({ profile }),
      clearUser: () => set({ jwt: null, profile: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
