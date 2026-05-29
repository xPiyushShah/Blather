import { create } from "zustand";
import Peer from "simple-peer/simplepeer.min.js";

import { useAuthStore } from "./authStore";
import { useChatStore } from "./useChatStore.js";

const ICE_SERVERS = {
    iceServers: [
        {
            urls: ["stun:bn-turn2.xirsys.com"],
        },
        {
            username:
                "KOo7L3-HXfompS_KFnBUpL2zPDmkLE18D7lfVKqr1bexPhmECxYyB5rcOM9ZYcrmAAAAAGhY84BibGF0aGVyNDAyMQ==",
            credential: "f2f0e73e-4ffa-11f0-b8dc-0242ac140004",
            urls: [
                "turn:bn-turn2.xirsys.com:80?transport=udp",
                "turn:bn-turn2.xirsys.com:3478?transport=udp",
                "turn:bn-turn2.xirsys.com:80?transport=tcp",
                "turn:bn-turn2.xirsys.com:3478?transport=tcp",
            ],
        },
    ],
};

export const useCallStore = create((set, get) => ({
    localStream: null,
    remoteStream: null,
    peer: null,

    incomingCallData: null,

    localStreamLoading: false,
    callType: false,

    isIncomingCall: false,
    isCallScreenOpen: false,

    isCallEsablished: false,

    setCallEsablished: (val) => {
        set({ isCallEsablished: val });
    },

    setIncomingCall: (data) => {
        set({
            isIncomingCall: data?.isIncomingCall || false,
            incomingCallData: data?.data || null,
        });
    },
    setCallScreen: () => {
        set((state) => ({
            isCallScreenOpen: !state.isCallScreenOpen,
        }));
    },
    setLocalStream: (stream) => {
        set({ localStream: stream });
    },

    setCallType: (callType) => {
        set({ callType });
    },

    initializeMedia: async (isCaller = false) => {
        const { callType } = get();

        set({ localStreamLoading: true });

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: callType,
                audio: true,
            });

            set({
                localStream: stream,
            });

            if (isCaller) {
                get().callInitializer();
            }

        } catch (error) {
            console.error(error);

            set({
                localStream: null,
            });
        } finally {
            set({
                localStreamLoading: false,
            });
        }
    },
    endCall: () => {
        // console.log("========== END CALL STARTED ==========");

        const { localStream, peer } = get();

        // console.log("Current localStream:", localStream);
        // console.log("Current peer:", peer);

        const { socket, authUser } = useAuthStore.getState();

        // console.log("Socket instance:", socket);
        // console.log("Authenticated user:", authUser);

        try {
            if (peer) {
                // console.log("Peer exists");

                if (!peer.destroyed) {
                    // console.log("Destroying peer connection...");
                    peer.destroy();
                    // console.log("Peer destroyed successfully");
                } else {
                    // console.log("Peer already destroyed");
                }
            } else {
                // console.log("No peer found");
            }

            if (socket) {
                // console.log("Socket found");

                // console.log("Emitting reject-call event...");
                socket.emit("reject-call", {
                    from: authUser?._id,
                });

                // console.log("reject-call emitted");
            } else {
                // console.log("Socket not found");
            }

            if (localStream) {
                // console.log("Stopping local media tracks...");

                localStream.getTracks().forEach((track, index) => {
                    console.log(`Stopping track ${index}:`, track.kind);
                    track.stop();
                });

                // console.log("All local tracks stopped");
            } else {
                // console.log("No local stream found");
            }
        } catch (error) {
            // console.error("Error during endCall:", error);
        }

        // console.log("Resetting zustand state...");

        set({
            localStream: null,
            remoteStream: null,
            peer: null,
            localStreamLoading: false,
            isCallScreenOpen: false,
            isIncomingCall: false,
            incomingCallData: null,
            isCallEsablished: false,
        });

        // console.log("State reset completed");
        // console.log("========== END CALL FINISHED ==========");
    },

    callInitializer: () => {
        // console.log("========== CALL INITIALIZER STARTED ==========");

        const { socket } = useAuthStore.getState();
        const { selectedUser } = useChatStore.getState();

        // console.log("Socket instance:", socket);

        const { localStream, callType } = get();

        // console.log("Local stream:", localStream);
        // console.log("Call type:", callType);

        if (!socket) return;
        //  {
        // console.error("Socket not found");

        // }

        if (!localStream) return;
        //  {
        //     console.error("Local stream not found");

        // }

        // console.log("Creating new peer instance...");

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: localStream,
            config: ICE_SERVERS,
        });

        // console.log("Peer created successfully:", peer);

        const targetSocketId = selectedUser._id;

        // console.log("Selected target socket/user id:", targetSocketId);

        if (!targetSocketId) return;
        //    {  console.error("Target socket id not found");

        // }

        peer.on("signal", (signal) => {
            // console.log("========== SIGNAL EVENT ==========");
            // console.log("Generated signal:", signal);

            // console.log("Emitting call-user event...");

            socket.emit("call-user", {
                signal,
                to: targetSocketId,
                type: callType,
            });

            // console.log("call-user emitted successfully");
        });

        peer.on("stream", (remoteStream) => {
            // console.log("========== REMOTE STREAM EVENT ==========");
            // console.log("Remote stream received:", remoteStream);

            set({ remoteStream });

            // console.log("Remote stream stored in zustand");
        });

        peer.on("connect", () => {
            // console.log("========== PEER CONNECTED ==========");
            // console.log("Peer connection established successfully");
            set({ isCallEsablished: true });
        });

        peer.on("close", () => {
            // console.log("========== PEER CLOSED ==========");
            // console.log("Peer connection closed");

            get().endCall();
        });

        peer.on("error", (err) => {
            // console.log("========== PEER ERROR ==========");
            // console.error("Peer error:", err);

            get().endCall();
        });

        // console.log("Saving peer into zustand state...");

        set({
            peer,
            isCallScreenOpen: true,
        });

        // console.log("Peer saved successfully");
        // console.log("========== CALL INITIALIZER FINISHED ==========");
    },

    answerCall: async (incomingSignal, callerSocketId, type) => {
        // console.log("========== ANSWER CALL STARTED ==========");

        // console.log("Incoming signal:", incomingSignal);
        // console.log("Caller socket id:", callerSocketId);
        // console.log("Call type:", type);

        const { socket } = useAuthStore.getState();

        // console.log("Socket instance:", socket);

        const { localStream } = get();

        // console.log("Local stream:", localStream);

        if (!socket) return;
        //     {
        //     console.error("Socket not found");

        // }

        if (!localStream) {
            // console.error("Local stream not found");
            get().initializeMedia(false);
        }

        // console.log("Creating peer for answering call...");

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: localStream,
            config: ICE_SERVERS,
        });

        // console.log("Answer peer created:", peer);

        peer.on("signal", (signal) => {
            // console.log("========== ANSWER SIGNAL EVENT ==========");
            // console.log("Generated answer signal:", signal);

            // console.log("Emitting answer-call event...");

            socket.emit("answer-call", {
                signal,
                to: callerSocketId,
                type,
            });

            // console.log("answer-call emitted successfully");
        });

        peer.on("stream", (remoteStream) => {
            // console.log("========== ANSWER REMOTE STREM EVENT ==========");
            // console.log("Remote stream received:", remoteStream);A

            set({
                remoteStream,
            });

            // console.log("Remote stream stored");
        });

        peer.on("connect", () => {
            // console.log("========== ANSWER CONNECT EVENT ==========");
            // console.log("Call connected successfully");
            set({ isCallEsablished: true });
        });

        peer.on("close", () => {
            // console.log("========== ANSWER CLOSE EVENT ==========");
            // console.log("Peer connection closed");

            get().endCall();
        });

        peer.on("error", (err) => {
            // console.log("========== ANSWER ERROR EVENT ==========");
            // console.error("Peer error:", err);

            get().endCall();
        });

        try {
            // console.log("Applying incoming signal to peer...");

            peer.signal(incomingSignal);

            // console.log("Incoming signal applied successfully");
        } catch (error) {
            // console.error("Error applying signal:", error);
        }

        // console.log("Saving answer peer to zustand...");

        set({
            peer,
            isIncomingCall: false,
            isCallScreenOpen: true,
        });

        // console.log("Answer peer saved successfully");
        // console.log("========== ANSWER CALL FINISHED ==========");
    },

    // endCall: () => {
    //     const { localStream, peer } = get();

    //     const { socket, authUser } = useAuthStore.getState();

    //     try {
    //         if (peer && !peer.destroyed) {
    //             peer.destroy();
    //         }

    //         if (socket) {
    //             socket.emit("reject-call", {
    //                 from: authUser?._id,
    //             });
    //         }

    //         if (localStream) {
    //             localStream.getTracks().forEach((track) => {
    //                 track.stop();
    //             });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }

    //     set({
    //         localStream: null,
    //         remoteStream: null,
    //         peer: null,
    //         localStreamLoading: false,
    //         isCallScreenOpen: false,
    //         isIncomingCall: false,
    //         incomingCallData: null,
    //     });
    // },

    // callInitializer: () => {
    //     const { socket } = useAuthStore.getState();

    //     const { localStream, callType } = get();

    //     if (!socket) { console.error("Socket not found"); return; };

    //     if (!localStream) { console.error("localstream not found"); return; };

    //     const peer = new Peer({
    //         initiator: true,
    //         trickle: false,
    //         stream: localStream,
    //         config: ICE_SERVERS,
    //     });
    //     console.log("peer created with config", peer);
    //     // var for calling user 
    //     const targetSocketId = useChatStore.getState().selectedUser?._id;// in backend using map will retain sockt id

    //     console.log("target user id for call", targetSocketId);

    //     peer.on("signal", (signal) => {
    //         console.log("signal generated by peer", signal);
    //         socket.emit("call-user", {
    //             signal,
    //             to: targetSocketId,
    //             type: callType,
    //         });
    //     });

    //     peer.on("stream", (remoteStream) => {
    //         console.log("remote stream received", remoteStream);
    //         set({
    //             remoteStream,
    //         });
    //     });

    //     peer.on("connect", () => {
    //         console.log("Peer connected");
    //     });

    //     peer.on("close", () => {
    //         console.log("Peer closed");
    //         get().endCall();
    //     });

    //     peer.on("error", (err) => {
    //         console.error(err);
    //         get().endCall();
    //     });

    //     set({
    //         peer,
    //         isCallScreenOpen: true,
    //     });
    // },

    // answerCall: async (
    //     incomingSignal,
    //     callerSocketId,
    //     type
    // ) => {
    //     const { socket } = useAuthStore.getState();

    //     const { localStream } = get();

    //     if (!socket) return;

    //     if (!localStream) return;

    //     const peer = new Peer({
    //         initiator: false,
    //         trickle: false,
    //         stream: localStream,
    //         config: ICE_SERVERS,
    //     });

    //     peer.on("signal", (signal) => {
    //         socket.emit("answer-call", {
    //             signal,
    //             to: callerSocketId,
    //             type,
    //         });
    //     });

    //     peer.on("stream", (remoteStream) => {
    //         set({
    //             remoteStream,
    //         });
    //     });

    //     peer.on("connect", () => {
    //         console.log("Call connected");
    //     });

    //     peer.on("close", () => {
    //         get().endCall();
    //     });

    //     peer.on("error", (err) => {
    //         console.error(err);
    //         get().endCall();
    //     });

    //     try {
    //         peer.signal(incomingSignal);
    //     } catch (error) {
    //         console.error(error);
    //     }

    //     set({
    //         peer,
    //         isIncomingCall: false,
    //         isCallScreenOpen: true,
    //     });
    // },
}));