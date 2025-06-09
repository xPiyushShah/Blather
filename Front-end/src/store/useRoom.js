import { create } from "zustand";
import { authStore } from "./authStore.js";

export const roomStore = create((set) => ({
  isRoom: false,
  createRoom: (data) => set({ isRoom: true, roomData: data }),

  setRoom: () =>
    set((state) => ({
      isRoom: !state.isRoom,
    })),

}));
