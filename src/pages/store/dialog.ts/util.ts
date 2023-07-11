import { create } from "zustand";

export interface DialogStoreState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function createDialogStore() {
  return create<DialogStoreState>((set, get) => ({
    isOpen: false,
    open: () => {
      set({ isOpen: true });
    },
    close: () => {
      set({ isOpen: false });
    },
  }));
}
