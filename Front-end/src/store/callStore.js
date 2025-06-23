import { create } from "zustand";
import Peer from "simple-peer/simplepeer.min.js";
import { authStore } from "./authStore.js";
import { handleCallAccepted, handleBusy, logPublicIPFromPeer } from "../helper/callhandler.js";

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

export const callStore = create((set, get) => ({
  localStream: null,
  remoteStream: null,
  peer: null,
  callInProgress: false,
  targetSocketId: null,
  callModal: null,
  callEstablished: false,
  incomingCall: false,
  getModal: false,

  callTimeout: null,
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
      console.log("[Media] Requesting user media...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callModal === "video",
        audio: true,
      });
      console.log("[Media] Local media stream obtained.");
      set({ localStream: stream });
      get().makeCall();
      set({ callInProgress: true });
    } catch (error) {
      console.error("[Media] Error accessing media devices:", error);
    }
  },

  makeCall: () => {
    const { targetSocketId, callModal, localStream, callTimeout } = get();
    const socket = authStore.getState().socket;

    if (!socket) {
      alert("❌ Socket not connected. Cannot make call.");
      return;
    }

    if (!localStream) {
      alert("❌ Local media stream not available.");
      return;
    }

    console.log("[Call] Creating initiator peer...");

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream,
      config: ICE_SERVERS,
    });

    console.log("peer inticalized", peer);

    peer.on("signal", (signal) => {
      console.log("[Peer] Generated signal:", signal);
      socket.emit("call-user", {
        signal,
        to: targetSocketId,
        type: callModal,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("[Peer] Remote stream received.");
      set({ remoteStream, callEstablished: true });
      logPublicIPFromPeer(peer);
    });

    peer.on("connect", () => {
      console.log("✅ [Peer] Connection established!");
      if (callTimeout) clearTimeout(callTimeout);
    });

    peer.on("error", (err) => {
      console.error("❌ [Peer] Error:", err);
      alert("Connection error. Check TURN server or network.");
      get().endCall();
    });

    peer.on("close", () => {
      console.log("🔌 [Peer] Connection closed.");
      get().endCall();
    });

    // if (onCallAcceptedHandler) socket.off("call-accepted", onCallAcceptedHandler);
    // if (onBusyHandler) socket.off("busy", onBusyHandler);

    // onCallAcceptedHandler = (data) => {
    //   console.log("[Socket] Call accepted signal received:", data);
    //   handleCallAccepted(data, get, set);
    // };

    // onBusyHandler = () => {
    //   console.log("[Socket] User is busy.");
    //   handleBusy(get);
    // };

    // socket.on("call-accepted", handleCallAccepted);
    // socket.on("busy", handleBusy);

    socket.off("call-accepted")
    socket.on("call-accepted", (data) => {
      peer.signal(data.signal);
      set({ callEstablished: true });
    });
    // socket.on("busy", handleBusy);

    setTimeout(() => {
      if (!get().callEstablished) {
        alert("Call failed to connect. Please check your network or TURN server.");
        console.log("[Call] Timeout: connection not established.");
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

    console.log("[Call] Answering call... Creating peer (not initiator)");

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream,
      config: ICE_SERVERS,
    });

    console.log("peer inticalized", peer);

    peer.on("signal", (signal) => {
      console.log("[Peer] Answer signal created:", signal);
      socket.emit("answer-call", { signal, to: callerSocketId, type });
      logPublicIPFromPeer(peer);
    });

    peer.on("connect", () => {
      console.log("✅ [Peer] Connection established on answer side!");
    });

    peer.on("stream", (remoteStream) => {
      console.log("[Peer] Remote stream received on answer side.");
      set({ remoteStream, callEstablished: true });
    });

    peer.on("error", (err) => {
      console.error("❌ [Peer] Error on answer side:", err);
      alert("Failed to answer call due to connection issue.");
      get().endCall();
    });

    peer.on("close", () => {
      console.log("🔌 [Peer] Connection closed (answer side).");
      get().endCall();
    });

    console.log("[Peer] Applying incoming signal...");
    peer.signal(incomingSignal);

    set({ peer, callInProgress: true, callEstablished: true });
  },

  endCall: () => {
    const { peer, localStream, incomingCall, callTimeout } = get();
    const socket = authStore.getState().socket;

    console.log("[Call] Ending call...");

    if (socket && incomingCall.from) {
      console.log("[Socket] Emitting reject-call to:", incomingCall.from);
      socket.emit("reject-call", { to: incomingCall.from });
    }

    if (peer) {
      console.log("[Peer] Destroying peer...");
      peer.destroy();
    }

    if (localStream) {
      console.log("[Media] Stopping local media tracks...");
      localStream.getTracks().forEach((track) => track.stop());
    }

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

    // clearTimeout(callTimeout);
    // if (callTimeout) {
    //   console.log("[Call] Cleared call timeout.");
    // }
  },
}));