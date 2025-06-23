export const handleCallAccepted = (data, get, set) => {
  const peer = get().peer;
  if (!peer) {
    console.error("No peer instance available on call accepted.");
    return;
  }
  peer.signal(data.signal);
  set({ callEstablished: true });
};

export const handleBusy = (get) => {
  alert("📞 User is busy.");
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
