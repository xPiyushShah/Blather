import { useEffect } from "react";
import { authStore } from "../store/authStore";
import { callStore } from "../store/callStore";

function SocketListeners() {
  const socket = authStore.getState().socket;
  const { setIncomingCall } = callStore();

  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-call", (data) => {
      console.log("📞 Incoming call:", data);
      setIncomingCall(data);
    });

    socket.on("call-accepted", (data) => {
      console.log("✅ Call accepted:", data);
      const peer = callStore.getState().peer;
      if (peer) peer.signal(data.signal);
    });

    socket.on("reject-call", () => {
      console.log("❌ Call rejected");
      callStore.getState().endCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("reject-call");
    };
  }, [socket]);

  return null;
}

export default SocketListeners;
