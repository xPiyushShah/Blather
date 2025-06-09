import { create } from "zustand";
import Peer from "simple-peer";
import { authStore } from "./authStore.js";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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

  peerConnection: null,
  callInProgress: false,

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
        video: callModal === "video" ? true : false,
        audio: true,
      });
      set({ localStream: stream });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    } finally {
      get().makeCall();
      set({ callInProgress: true });
    }
  },

  makeCall: () => {
    const { targetSocketId, callModal, localStream } = get();
    const socket = authStore.getState().socket;

    if (!socket) {
      console.error("Cannot make call: missing socket.");
      return;
    }
    if (!localStream) {
      console.error("Missing localStream");
      return;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream,
      // config: ICE_SERVERS,
    });

    peer.on("signal", (signal) => {
      socket.emit("call-user", { signal, to: targetSocketId, type: callModal });
    });

    peer.on("stream", (remoteStream) => {
      set({ remoteStream, callEstablished: true });
    });

    socket.off("call-accepted");
    socket.on("call-accepted", (data) => {
      // console.log("✅ Call accepted:", data);
      peer.signal(data.signal);
      set({ callEstablished: true });
    });

    socket.off("busy");
    socket.on("busy", (data) => {
      console.log("�� User is busy:", data);
      get().endCall();
    })

    set({ peer, callInProgress: true, localStream: localStream });
  },

  answerCall: async (incomingSignal, callerSocketId, type) => {
    const socket = authStore.getState().socket;
    const localStream = get().localStream;
    if (!socket) {
      console.error("Cannot make call: missing socket reciver .");
      return;
    }
    if (!localStream) {
      console.error("Missing localStream reciver ");
      return;
    }

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream,
      // config: ICE_SERVERS,
    });

    peer.on("signal", (signal) => {
      socket.emit("answer-call", { signal, to: callerSocketId, type });
    });

    peer.on("stream", (remoteStream) => {
      set({ remoteStream, callEstablished: true });
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
  },
}));
