import { create } from "zustand";
import Peer from "simple-peer";
import { authStore } from "./authStore.js";

// const ICE_SERVERS = {
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };
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
      config: ICE_SERVERS, // ✅ Xirsys TURN/STUN servers
    });

    // 🔁 Exchange signaling
    peer.on("signal", (signal) => {
      socket.emit("call-user", {
        signal,
        to: targetSocketId,
        type: callModal,
      });
    });

    // ✅ When remote stream is received
    peer.on("stream", (remoteStream) => {
      set({ remoteStream, callEstablished: true });
    });

    // ✅ When connected
    peer.on("connect", () => {
      console.log("✅ Peer connection established!");
      clearTimeout(timeout); // Cancel timeout if connected
    });

    // ❌ If error occurs
    peer.on("error", (err) => {
      console.error("❌ Peer connection error:", err);
      alert("Connection error. Check TURN server or network.");
      get().endCall();
    });

    // 🔌 If peer disconnects
    peer.on("close", () => {
      console.log("🔌 Peer connection closed.");
      get().endCall();
    });

    // 🔁 Call accepted signal
    socket.off("call-accepted");
    socket.on("call-accepted", (data) => {
      peer.signal(data.signal);
      set({ callEstablished: true });
    });

    // 🚫 If user is busy
    socket.off("busy");
    socket.on("busy", () => {
      alert("📞 User is busy.");
      get().endCall();
    });

    // ⏱ Add fallback timeout (e.g. 15s)
    const timeout = setTimeout(() => {
      if (!get().callEstablished) {
        alert(
          "Call failed to connect. Please check your network or TURN server."
        );
        get().endCall();
      }
    }, 15000);

    // ✅ Store the peer
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
      config: ICE_SERVERS, // ✅ USE TURN/STUN
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

  // makeCall: () => {
  //   const { targetSocketId, callModal, localStream } = get();
  //   const socket = authStore.getState().socket;

  //   if (!socket) {
  //     console.error("Cannot make call: missing socket.");
  //     return;
  //   }
  //   if (!localStream) {
  //     console.error("Missing localStream");
  //     return;
  //   }

  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream: localStream,
  //     config: ICE_SERVERS,
  //   });

  //   peer.on("signal", (signal) => {
  //     socket.emit("call-user", { signal, to: targetSocketId, type: callModal });
  //   });

  //   peer.on("stream", (remoteStream) => {
  //     set({ remoteStream, callEstablished: true });
  //   });

  //   socket.off("call-accepted");
  //   socket.on("call-accepted", (data) => {
  //     // console.log("✅ Call accepted:", data);
  //     peer.signal(data.signal);
  //     set({ callEstablished: true });
  //   });

  //   socket.off("busy");
  //   socket.on("busy", (data) => {
  //     console.log("�� User is busy:", data);
  //     get().endCall();
  //   })

  //   set({ peer, callInProgress: true, localStream: localStream });
  // },

  // answerCall: async (incomingSignal, callerSocketId, type) => {
  //   const socket = authStore.getState().socket;
  //   const localStream = get().localStream;
  //   if (!socket) {
  //     console.error("Cannot make call: missing socket reciver .");
  //     return;
  //   }
  //   if (!localStream) {
  //     console.error("Missing localStream reciver ");
  //     return;
  //   }

  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: localStream,
  //     config: ICE_SERVERS,
  //   });

  //   peer.on("signal", (signal) => {
  //     socket.emit("answer-call", { signal, to: callerSocketId, type });
  //   });

  //   peer.on("stream", (remoteStream) => {
  //     set({ remoteStream, callEstablished: true });
  //   });

  //   peer.signal(incomingSignal);

  //   set({ peer, callInProgress: true, callEstablished: true });
  // },

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
