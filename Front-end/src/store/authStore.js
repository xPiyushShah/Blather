import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "https://blather.onrender.com";

export const authStore = create((set, get) => ({
  authUser: null,
  onlineUser: [],
  isSigninUp: false,
  isLogIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      // toast.error("Auth check failed: " + error.message);
      set({ authUser: null });
      console.error("Error checking authentication:", error.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      localStorage.setItem("auth_token", res.data.token);
      toast.success("User registered successfully");
      set({
        authUser: res.data.user,
        isLogIn: true,
      });
      get().connectSocket();
    } catch (error) {
      toast.error("Sign up failed: " + error.message);
      // console.error("Error signing up:", error.message);
    } finally {
      set({ isSigninUp: false });
    }
  },

  logIn: async (data) => {
    set({ isLogIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem("auth_token", res.data.token);
      toast.success("You are logged in");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      toast.error("Login failed: " + error.message);
      // console.error("Error logging in:", error.message);
    } finally {
      set({ isLogIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      toast.success("Profile updated successfully");
      set({ authUser: res.data.user });
      
      get().connectSocket();
    } catch (error) {
      toast.error("Profile update failed: " + error.message);
      console.error("Error updating profile:", error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateImage: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-image", data);
      toast.success("Image updated successfully");
    } catch (error) {
      toast.error("Image update failed: " + error.message);
      console.error("Error updating image:", error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logOut: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      localStorage.removeItem("auth_token");
      toast.success("You have logged out");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
      // console.error("Error logging out:", error.message);
    }
  },

  addfriend: async (id) => {
    try {
      const res = await axiosInstance.post(`/auth/addfriend/${id}`);
      toast.success(res.message);
    } catch (error) {
      toast.error("Failed to add friend");
      // console.error("Error adding friend:", error.message);
    }
  },
  
  acceptfriend: async (id) => {
    try {
      const res = await axiosInstance.post(`/auth/accept_reqst/${id}`);
      toast.success(res.message);
    } catch (error) {
      toast.error("Failed to add friend");
      // console.error("Error adding friend:", error.message);
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser) return;
    if (socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("userList", (usersIds) => {
      set({ onlineUser: usersIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, onlineUser: [] });
    }
  },
}));
