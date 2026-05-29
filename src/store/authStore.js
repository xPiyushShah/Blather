import { create } from 'zustand';
import { axiosInstance } from '../libs/axiosInstance';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    isCheckingAuth: false,
    isLoginingIn: false,
    isSignupIn: false,
    authUser: null,
    tokenValue: null,
    socket: null,
    onlineSocktUser: [],
    checkAuth: async () => {
        if (get().authUser !== null) return;
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data.user });
        } catch (error) {
            set({ isCheckingAuth: false });
            // alert("Session expired. Please login again.");
            set({ authUser: false });
        } finally {
            set({ isCheckingAuth: false });
            get().connectSocket();
        }
    },
    signIn: async (data) => {
        set({ isLoginingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            // console.log(res)
            toast.success(res.data.message);
            set({ authUser: res.data.user });
            await get().setToken(res.data.token);
            await get().checkAuth();
        } catch (error) {
            toast.error(error.response.data.message);
            set({ authUser: false });
        } finally {
            set({ isLoginingIn: false });
            get().connectSocket();
            window.location.reload();
        }
    },
    signUp: async (data) => {
        set({ isSignupIn: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data.user });
            // console.log(res);
            toast.success(res.data.message);
            await get().setToken(res.data.token);
            await get().checkAuth();
        } catch (error) {
            toast.error(error.response.data.message);
            set({ authUser: false });
        } finally {
            set({ isSignupIn: false });
            get().connectSocket();
            window.location.reload();
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
            // toast.error("Logout failed: " + error.message);
            // console.error("Error logging out:", error.message);
        }
    },
    setToken: async (token) => {
        console.log("token is:", token)
        if (!token) return;
        set({ tokenValue: token });
        localStorage.setItem("blather_token", token);
        console.log("token set", token)
    },
    connectSocket: async () => {

        const { socket, authUser } = get();

        if (!authUser) return;
        if (socket?.connected) return;

        const newSocket = io(BASE_URL, {
            query: { userId: authUser._id },
            transports: ["websocket"],
            withCredentials: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        set({ socket: newSocket });

        newSocket.connect();
        // newSocket.on("connect", () => {
        //     // console.log("socket id", newSocket.id);
        //     // console.log("socket connected", newSocket.connected);
        // });

        newSocket.on("connect_error", (err) => {
            console.log("Connection error:", err.message);
        });

        newSocket.on("userList", (usersIds) => {
            set({ onlineSocktUser: usersIds });
        });

        // console.log("sock", authUser);
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null, onlineSocktUser: [] });
        }
    },
}));