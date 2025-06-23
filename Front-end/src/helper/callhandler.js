export const handleCallAccepted = (data, get, set) => {
  const peer = get().peer;
  if (!peer) {
    console.error("No peer instance available on call accepted.");
    return;
  }
  console.log("[Socket] Call accepted signal received:", data);
  peer.signal(data.signal);
  set({ callEstablished: true });
};

export const handleBusy = (get) => {
  alert("📞 User is busy.");
  console.log("[Socket] User is busy.");
  get().endCall();
};

export const logPublicIPFromPeer = (peer) => {
  if (!peer || !peer._pc) {
    console.warn("[IP Logger] Peer connection not available.");
    return;
  }

  console.log("[IP Logger] Listening for ICE candidates...");

  peer._pc.onicecandidate = (event) => {
    if (!event.candidate) return;

    const candidateStr = event.candidate.candidate;
    console.log("[ICE] Candidate string:", candidateStr);

    if (candidateStr.includes("typ srflx") || candidateStr.includes("typ relay")) {
      const match = candidateStr.match(/(\d{1,3}\.){3}\d{1,3}/);
      if (match) {
        console.log("🌍 Public IP (via ICE):", match[0]);
      }
    }
  };
}
export const makecall = () => {
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

};
