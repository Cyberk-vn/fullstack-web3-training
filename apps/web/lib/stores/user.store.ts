import { persist, createJSONStorage } from "zustand/middleware";
import { createControlledStore } from "./store";

const STORAGE_KEY = "user-store";

interface State {
  jwt?: string;
}

interface Actions {
  setJwt: (jwt: string) => void;
}

const initialState: State = {
  jwt: undefined,
};

export const useUserStore = createControlledStore<State & Actions>()(
  persist(
    set => ({
      ...initialState,
      setJwt: jwt => set({ jwt }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
