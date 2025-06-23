import { create } from "zustand";
import Peer from "simple-peer/simplepeer.min.js";
import { authStore } from "./authStore.js";
import { handleCallAccepted, handleBusy } from "../helper/callhandler.js";

const ICE_SERVERS = {
  iceServers: [
    { urls: ["stun:bn-turn2.xirsys.com"] },
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

export const callStore = create((set, get) => {
  let callTimeout;

  // Store event handler refs to properly off/on them
  let onCallAcceptedHandler = null;
  let onBusyHandler = null;

  return {
    localStream: null,
    remoteStream: null,
    peer: null,
    callInProgress: false,
    targetSocketId: null,
    callModal: null,
    callEstablished: false,
    incomingCall: false,
    getModal: false,

    peerConnection: null,

    setModal: (isOpen) => set({ callModal: isOpen }),
    setTargetSocketId: (id) => set({ targetSocketId: id?._id || id }),
    setlocalStream: (stream) => set({ localStream: stream }),
    setremoteStream: (stream) => set({ remoteStream: stream }),
    setIncomingCall: (data) => set({ incomingCall: data }),
    setGetModal: (data) => set({ getModal: data }),
    setPeer: (peer) => set({ peer }),

    initializeMedia: async () => {
      const callModal = get().callModal;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callModal === "video",
          audio: true,
        });
        set({ localStream: stream });
        get().makeCall();
        set({ callInProgress: true });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    },

    makeCall: () => {
      const { targetSocketId, callModal, localStream } = get();
      const socket = authStore.getState().socket;

      if (!socket) {
        alert("❌ Socket not connected. Cannot make call.");
        return;
      }

      if (!localStream) {
        alert("❌ Local media stream not available.");
        return;
      }

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: localStream,
        config: ICE_SERVERS,
      });

      peer.on("signal", (signal) => {
        socket.emit("call-user", {
          signal,
          to: targetSocketId,
          type: callModal,
        });
      });

      peer.on("stream", (remoteStream) => {
        set({ remoteStream, callEstablished: true });
      });

      peer.on("connect", () => {
        console.log("✅ Peer connection established!");
        if (callTimeout) clearTimeout(callTimeout);
      });

      peer.on("error", (err) => {
        console.error("❌ Peer connection error:", err);
        alert("Connection error. Check TURN server or network.");
        get().endCall();
      });

      peer.on("close", () => {
        console.log("🔌 Peer connection closed.");
        get().endCall();
      });

      // Clean up old listeners before adding new ones
      if (onCallAcceptedHandler) socket.off("call-accepted", onCallAcceptedHandler);
      if (onBusyHandler) socket.off("busy", onBusyHandler);

      onCallAcceptedHandler = (data) => handleCallAccepted(data, get, set);
      onBusyHandler = () => handleBusy(get);

      socket.on("call-accepted", onCallAcceptedHandler);
      socket.on("busy", onBusyHandler);

      callTimeout = setTimeout(() => {
        if (!get().callEstablished) {
          alert(
            "Call failed to connect. Please check your network or TURN server."
          );
          get().endCall();
        }
      }, 60000);

      set({ peer, callInProgress: true });
    },

    answerCall: async (incomingSignal, callerSocketId, type) => {
      const socket = authStore.getState().socket;
      const localStream = get().localStream;

      if (!socket) {
        alert("Socket not connected.");
        return;
      }
      if (!localStream) {
        alert("No local stream. Can't answer call.");
        return;
      }

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: localStream,
        config: ICE_SERVERS,
      });

      peer.on("signal", (signal) => {
        socket.emit("answer-call", { signal, to: callerSocketId, type });
      });

      peer.on("connect", () => {
        console.log("✅ Peer connection established!");
      });

      peer.on("stream", (remoteStream) => {
        set({ remoteStream, callEstablished: true });
      });

      peer.on("error", (err) => {
        console.error("❌ Peer error:", err);
        alert("Failed to answer call due to connection issue.");
        get().endCall();
      });

      peer.on("close", () => {
        console.log("🔌 Peer connection closed.");
        get().endCall();
      });

      peer.signal(incomingSignal);

      set({ peer, callInProgress: true, callEstablished: true });
    },

    endCall: () => {
      const { peer, localStream, incomingCall } = get();
      const socket = authStore.getState().socket;

      if (socket && incomingCall?.from) {
        socket.emit("reject-call", { to: incomingCall.from });
      }

      if (peer) peer.destroy();

      if (localStream) localStream.getTracks().forEach((track) => track.stop());

      set({
        localStream: null,
        remoteStream: null,
        peer: null,
        callInProgress: false,
        targetSocketId: null,
        callModal: null,
        callEstablished: false,
        incomingCall: false,
      });

      if (callTimeout) clearTimeout(callTimeout);
    },
  };
});
