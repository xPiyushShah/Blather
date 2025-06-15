import { create } from "zustand";
import { useChatStore } from "./useChatStore";
import toast from "react-hot-toast";

export const functionStore = create((set, get) => ({
  isNotify: false,
  isProfile: false,
  isStar: false,
  isSetting: false,
  isRoom: false,
  isFriend: false,
  isUsrProfile: false,

  usrID: null,
  starredMessages: [],

  setNotify: () =>
    set((state) => ({
      isNotify: !state.isNotify,
      isProfile: false,
      isStar: false,
      isSetting: false,
      isRoom: false,
      isNotify: false,
      isFriend: false,
    })),

  setUsrId: (usrID) => {
    set({ usrID: usrID });
    get().setProfile();
  },

  setProfile: () =>
    set((state) => ({
      isProfile: !state.isProfile,
      isUsrProfile: false,
      isStar: false,
      isSetting: false,
      isRoom: false,
      isNotify: false,
      isFriend: false,
    })),
  setStar: () =>
    set((state) => ({
      isStar: !state.isStar,
      isProfile: false,
      isSetting: false,
      isRoom: false,
      isNotify: false,
      isFriend: false,
      usrID: null,
    })),
  setSetting: () =>
    set((state) => ({
      isSetting: !state.isSetting,
      isProfile: false,
      isStar: false,
      isRoom: false,
      isNotify: false,
      isFriend: false,
      usrID: null,
    })),
  setRoom: () =>
    set((state) => ({
      isRoom: !state.isRoom,
      isProfile: false,
      isStar: false,
      isSetting: false,
      isFriend: false,
      isNotify: false,
      usrID: null,
    })),
  setFriend: () => {
    const { setUserLoading } = useChatStore.getState();
    setUserLoading(false);
    set((state) => ({
      isFriend: !state.isFriend,
      isProfile: false,
      isStar: false,
      isSetting: false,
      isNotify: false,
      usrID: null,
    }));
  },

  saveStarMessae: async (messageData) => {
    // try {
    //   const res = await axiosInstance.post(
    //     `/messages/star_message`,
    //     messageData
    //   );
    // } catch (error) {
    //   toast.error("Failed to save message");
    // }
  },

  starMessage: (message) => {
    set((state) => ({
      starredMessages: [...state.starredMessages, message],
    }));
    get().saveStarMessae(message);
  },
}));
