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
      isFriend: false,
    })),

  setUsrId: (usrID) => {
    set({ usrID });
    get().setProfile();
  },

  setProfile: () =>
    set(() => ({
      isProfile: !get().isProfile,
      isUsrProfile: false,
      isStar: false,
      isSetting: false,
      isRoom: false,
      isNotify: false,
      isFriend: false,
    })),

  setStar: () =>
    set(() => ({
      isStar: !get().isStar,
      isProfile: false,
      isSetting: false,
      isRoom: false,
      isNotify: false,
      isFriend: false,
      usrID: null,
    })),

  setSetting: () =>
    set(() => ({
      isSetting: !get().isSetting,
      isProfile: false,
      isStar: false,
      isRoom: false,
      isNotify: false,
      isFriend: false,
      usrID: null,
    })),

  setRoom: () =>
    set(() => ({
      isRoom: !get().isRoom,
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
    set(() => ({
      isFriend: !get().isFriend,
      isProfile: false,
      isStar: false,
      isSetting: false,
      isNotify: false,
      usrID: null,
    }));
  },

  saveStarMessae: async (messageData) => {
    // Optional async save logic here
  },

  starMessage: (message) => {
    set((state) => ({
      starredMessages: [...state.starredMessages, message],
    }));
    // Side effects outside set
    const starred = get().starredMessages;
    localStorage.setItem("st_message", JSON.stringify(starred));
    toast.success("Message starred and saved locally!");
    get().saveStarMessae(message);
  },

  removeStarMessage: (message) => {
    set((state) => ({
      starredMessages: state.starredMessages.filter((msg) => {
        if (message._id && msg._id) return msg._id !== message._id;
        if (message.uid && msg.uid) return msg.uid !== message.uid;
        return msg._id !== message._id && msg.uid !== message.uid;
      }),
    }));
    // Side effects outside set
    const starred = get().starredMessages;
    localStorage.setItem("st_message", JSON.stringify(starred));
    toast.success("Message removed from starred and updated locally!");
  },

  loadStarMessages: () => {
    try {
      const stored = JSON.parse(localStorage.getItem("st_message"));
      if (Array.isArray(stored)) {
        set({ starredMessages: stored });
      } else if (stored !== null && stored !== undefined) {
        set({ starredMessages: [stored] });
      } else {
        set({ starredMessages: [] });
      }
    } catch (error) {
      console.error("Failed to parse starred messages:", error);
      set({ starredMessages: [] });
    }
  },
  //  useEffect(() => {
  //   // Sync to localStorage every second
  //   const interval = setInterval(() => {
  //     updateLocalStarMessages();
  //   }, 1000);

  //   return () => clearInterval(interval); // cleanup on unmount
  // }, [updateLocalStarMessages]);
}));
