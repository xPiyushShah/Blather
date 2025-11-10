import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios.js";
import { authStore } from "./authStore.js";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  pend_users: [],
  isTyping: null,
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  friendList: [],
  isFriendLoading: false,
  count: 0,
  key: "LUABI-BLATHER",
  MyFrnd: true,
  // MyFrnd: false,
  MyFrndStat: null,

  getUsers: async () => {
    // this is for load frnd rqst and send rqst - gloabl user
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.post("/messages/users");
      // console.log(res)
      set({ users: res.data });
    } catch (error) {
      // toast.error("Failed to fetch user");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getfriend: async () => {
    set({ isFriendLoading: true });
    // set({ isUserLoading: true });
    try {
      const response = await axiosInstance.get("/auth/friendlist");
      set({ friendList: response.data });
    } catch (error) {
      // toast.error("Failed to fetch user");
    } finally {
      set({ isFriendLoading: false });
      // set({ isUserLoading: false });
    }
  },

  getFriendStatus: async (userId) => {
    // try {
    //   console.log("User id is :", userId);
    //   const response = await axiosInstance.post(`/auth/getfunction/${userId}`);
    //   set({ MyFrnd: response.data.status, MyFrndStat: response.data });
    // } catch (error) {
    //   // toast.error("Failed to fetch messages");
    //   set({ MyFrnd: false });
    // }
  },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const response = await axiosInstance.post(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      // toast.error("Failed to fetch messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const myId = authStore.getState().authUser;
    const socket = authStore.getState().socket;

    try {
      // const res = await axiosInstance.post(
      //   `/messages/send-msg/${selectedUser._id}`,
      //   encryptMsg
      // );
      const msg = {
        uid: uuidv4(),
        senderId: myId._id,
        receiverId: selectedUser._id,
        image: messageData.image,
        text: messageData.text,
        createdAt: new Date().toISOString(),
      };
      socket.emit("send-message", {
        to: selectedUser._id,
        data: msg,
        from: myId._id,
        time: new Date().toISOString(),
      });
      set({ messages: [...messages, msg] });
      // toast.success("Message sent successfully");
    } catch (error) {
      toast.error("Failed to send message");
      console.log(err.message);
    }
  },

  sendMedia: async (messageData) => {
    const { selectedUser, messages } = get();
    const myId = authStore.getState().authUser;
    const socket = authStore.getState().socket;
    const formData = new FormData();
    if (messageData.audio) formData.append("audio", messageData.audio);
    if (messageData.video) formData.append("video", messageData.video, "video.webm");
    try {
      console.log("Sending message media:", messageData);
      const res = await axiosInstance.post(
        `/messages/send-media/${selectedUser._id}`,
        formData
      );
      // const msg = {
      //   senderId: myId._id,
      //   receiverId: selectedUser._id,
      //   audio: formData.audio,
      //   video: formData.video,
      //   createdAt: new Date().toISOString(),
      // };
      socket.emit("send-message", {
        to: selectedUser._id,
        data: res.data,
        from: myId._id,
        time: new Date().toISOString(),
      });
      set({ messages: [...messages, res.data] });
      toast.success("Media sent successfully");
    } catch (err) {
      toast.error("Not Sent");
      console.log(err.message);
    }
  },

  deleteMessage: async (messageId) => {
    const { selectedUser, messages } = get();
    try {
      await fetch(`/messages/${messageId}`, {
        method: "DELETE",
      });
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  },

  setSelctedUser: (selectedUser) => {
    // const id = selectedUser;
    // if(id === get().selectedUser) {
    //   set({ selectedUser: null }); // Step 1: reset to null
    //   return;    }
    // set({ messages: [], }); // Step 1: reset to null
    set({ selectedUser });     // Step 2: update with new value
    setTimeout(() => {
    }, 2000);
  },

  subScribeMessages: (userId) => {
    const { selectedUser, count } = get();
    if (!selectedUser) return;
    const socket = authStore.getState().socket;

    socket.on("receive-message", (msg) => {
      set({ messages: [...get().messages, msg] });
    });

    const handleTyping = (data) => {
      set({ isTyping: data });
    };

    socket.on("typing", handleTyping);
    // socket.on("message", (msg) => {
    //   set({ messages: [...get().messages, msg], count: count + 1 });
    // });
  },

  unSubscribeMessages: () => {
    const { selectedUser, count } = get();
    const authUser = authStore.getState().authUser;
    if (!selectedUser && !authUser) return;
    const socket = authStore.getState().socket;
    socket.off("receive-message"); // clean up
    socket.off("typing"); // clean up
  },

  subScribeToUser: (userId) => {
    set({ selectedUser: userId });
  },

  setUserLoading: (value) => set({ isUserLoading: value }),

  updateMessage: (data) => set({ messages: [...get().messages, data] }),
}));
