import { create } from "zustand";

type States = {
  isOpen: boolean;
};

type Actions = {
  open: () => void;
  close: () => void;
};

const defaultValues: States = {
  isOpen: false,
};

export const useSignMessageLoginModalStore = create<
  States & { actions: Actions }
>(set => ({
  ...defaultValues,
  actions: {
    open: () => {
      set(() => ({
        isOpen: true,
      }));
    },
    close: () => {
      set(() => ({
        isOpen: false,
      }));
    },
  },
}));

export const useSignMessageLoginModalStoreActions = () => {
  const { open, close } = useSignMessageLoginModalStore(state => state.actions);
  return {
    open,
    close,
  };
};
