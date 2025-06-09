import { create } from "zustand";

export const functionStore = create((set) => ({
  isNotify: false,
  isProfile: false,
  isStar: false,
  isSetting: false,
  isRoom: false,
  isFriend: false,

  // setStar: (isStar) =>
  //   set({
  //     isStar,
  //     isNotify: false,
  //     isProfile: false,
  //     isSetting: false,
  //     isRoom: false,
  //   }),
  // setSetting: (isSetting) =>
  //   set({
  //     isSetting,
  //     isNotify: false,
  //     isProfile: false,
  //     isStar: false,
  //     isRoom: false,
  //   }),
  // setRoom: (isRoom) =>
  //   set({
  //     isRoom,
  //     isNotify: false,
  //     isProfile: false,
  //     isStar: false,
  //     isSetting: false,
  //   }),
  setNotify: () =>
    set((state) => ({
      isNotify: !state.isNotify,
      isProfile: false,
      isStar: false,
      isSetting: false,
      isRoom: false,
      isNotify: false,
    })),
  setProfile: () =>
    set((state) => ({
      isProfile: !state.isProfile,
      isStar: false,
      isSetting: false,
      isRoom: false,
      isNotify: false,
    })),
  setStar: () =>
    set((state) => ({
      isStar: !state.isStar,
      isProfile: false,
      isSetting: false,
      isRoom: false,
      isNotify: false,
    })),
  setSetting: () =>
    set((state) => ({
      isSetting: !state.isSetting,
      isProfile: false,
      isStar: false,
      isRoom: false,
      isNotify: false,
    })),
  setRoom: () =>
    set((state) => ({
      isRoom: !state.isRoom,
      isProfile: false,
      isStar: false,
      isSetting: false,
      isNotify: false,
    })),
  setFriend: () =>
    set((state) => ({
      isFriend: !state.isFriend,
      isProfile: false,
      isStar: false,
      isSetting: false,
      isNotify: false,
    })),
}));
