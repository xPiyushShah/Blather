import { create } from "zustand";
import { axiosInstance } from "../libs/axiosInstance";
import { useAuthStore } from "./authStore";
import { v4 as uuidv4 } from "uuid";

export const useChatStore = create((set, get) => ({
    selectedUser: null,
    friendList: [],
    isUserLoading: false,
    isMessageLoading: false,
    messages: [],
    key: "LUABI-BLATHER",
    setSelectedUser: (user) => {
        if (user._id === get().selectedUser?._id) { set({ selectedUser: null }); return; }
        set({ selectedUser: user })
    },
    getUsers: async () => {
        // this is for load frnd rqst and send rqst - gloabl user
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.post("/messages/users");
            // console.log(res)
            set({ friendList: res.data });
        } catch (error) {
            // toast.error("Failed to fetch user");
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userId) => {
        if (!userId) return;

        set({ isMessageLoading: true });

        try {
            const response = await axiosInstance.post(`/messages/${userId}`);

            set({ messages: response.data });
        } catch (error) {
            console.log("Failed to fetch messages", error);
        } finally {
            set({ isMessageLoading: false });
        }
    },
    sendMedia: async (messageData) => {
        const { authUser, socket } = useAuthStore.getState();
        const { selectedUser, messages } = get();

        try {
            const formData = new FormData();


            // console.log("Message Data in sendMedia:", messageData);
            // TEXT (IMPORTANT)
            if (messageData.text) {
                formData.append("text", messageData.text);
            }

            if (messageData.file) {
                formData.append("file", messageData.file);
            }

            // console.log("after binding formdata", formData);
            // for (let pair of formData.entries()) {
            //     console.log(pair[0], pair[1]);
            // }
            // API CALL
            const res = await axiosInstance.post(`/messages/send-media/${selectedUser._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // SOCKET EMIT USING SERVER RESPONSE
            socket.emit("send-message", {
                to: selectedUser._id,
                data: res.data,
                from: authUser._id,
                time: new Date().toISOString(),
            });

            // UPDATE UI
            set({ messages: [...messages, res.data], });

        } catch (error) {
            console.error("Error sending media message:", error);
        }
    },
    // sendMedia: async (messageData) => {
    //     const { authUser, socket } = useAuthStore.getState();
    //     const { selectedUser, messages } = get();

    //     try {
    //         const file = messageData.file;

    //         let mediaType = null;

    //         // Detect type from base64 or file mime (fallback safe)
    //         if (file) {
    //             if (file.startsWith("data:image")) mediaType = "image";
    //             else if (file.startsWith("data:video")) mediaType = "video";
    //             else if (file.startsWith("data:audio")) mediaType = "audio";
    //             else if (file.startsWith("data:application/pdf")) mediaType = "pdf";
    //             else mediaType = "file";
    //         }

    //         const msg = {
    //             uid: uuidv4(),
    //             senderId: authUser._id,
    //             receiverId: selectedUser._id,

    //             text: messageData.text || "",

    //             file: file || null,
    //             mediaType, // IMPORTANT

    //             createdAt: new Date().toISOString(),
    //         };

    //         socket.emit("send-message", {
    //             to: selectedUser._id,
    //             data: msg,
    //             from: authUser._id,
    //             time: new Date().toISOString(),
    //         });

    //         set({
    //             messages: [...messages, msg],
    //         });

    //     } catch (error) {
    //         console.error("Error sending media message:", error);
    //     }
    // },
    sendMessage: async (messageData) => {
        const { authUser, socket } = useAuthStore.getState();
        const { selectedUser, messages } = get();

        // if (messageData.file) {
        //     await get().sendMedia(messageData);
        //     return;
        // }

        try {
            const msg = {
                uid: uuidv4(),
                senderId: authUser._id,
                receiverId: selectedUser._id,
                image: null,
                text: messageData.text,

                file: null,
                mediaType: null,

                createdAt: new Date().toISOString(),
            };
            socket.emit("send-message", {
                to: selectedUser._id,
                data: msg,
                from: authUser._id,
                time: new Date().toISOString(),
            });
            set({ messages: [...messages, msg] });
            //   toast.success("Media sent successfully");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    },
    subScribeMessages: (userId) => {
        const { selectedUser, count } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("receive-message", (msg) => {
            console.log("Received message:", msg);
            console.log("Messgae aya jii")
            set({ messages: [...get().messages, msg] });
        });

        // const handleTyping = (data) => {
        //   set({ isTyping: data });
        // };

        // socket.on("typing", handleTyping);
        // socket.on("message", (msg) => {
        //   set({ messages: [...get().messages, msg], count: count + 1 });
        // });
    },

    unSubscribeMessages: () => {
        const { selectedUser } = get();
        const { authUser, socket } = useAuthStore.getState();
        if (!selectedUser && !authUser) return;
        socket.off("receive-message"); // clean up
        socket.off("typing"); // clean up
    },

    subScribeToUser: (userId) => {
        set({ selectedUser: userId });
    },
    updateMessage: (data) => set({ messages: [...get().messages, data] }),
}));