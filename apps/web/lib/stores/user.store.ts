import { persist, createJSONStorage } from "zustand/middleware";
import { createControlledStore } from "./store";
interface State {
  jwt?: string;
}

interface Actions {
  setJwt: (jwt: string) => void;
  clear: () => void;
}

const initialState: State = {
  jwt: undefined,
};

const useUserStore = createControlledStore<State & Actions>()(
  persist(
    set => ({
      ...initialState,
      setJwt: (jwt: string) => set({ jwt }),
      clear() {
        set(initialState);
      },
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage for JWT persistence
      //   onRehydrateStorage: (state, error) => {
      //     console.log("onRehydrateStorage", state, error);
      //   },
    }
  )
);

export { useUserStore };
