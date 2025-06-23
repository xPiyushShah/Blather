// src/helper/callHandler.js
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
