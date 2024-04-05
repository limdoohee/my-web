import { create } from "zustand";

export const useStore = create((set) => ({
  click: false,
  setClick: (e) => set(() => ({ click: e })),
}));
