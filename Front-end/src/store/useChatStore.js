import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios.js";
import { authStore } from "./authStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  count: 0,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      toast.error("Failed to fetch user");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send-msg/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error("Failed to send message");
    }
  },

  setSelctedUser: (selectedUser) => {
    set({ selectedUser });
    // getMessages(selectedUser._id);
  },

  subScribeMessages: (userId) => {
    const { selectedUser, count } = get();
    if (!selectedUser) return;
    const socket = authStore.getState().socket;
    socket.on("message", (msg) => {
      set({ messages: [...get().messages, msg], count: count + 1 });
    });
  },

  unSubscribeMessages: () => {
    const socket = authStore.getState().socket;
    socket.off("message");
  },

  subScribeToUser: (userId) => {
    set({ selectedUser: userId });
  },
}));
