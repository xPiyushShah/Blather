import { create } from "zustand";

export const useNetworkStore = create((set, get) => {
  let axiosSent = 0;
  let axiosReceived = 0;
  let socketSent = 0;
  let socketReceived = 0;
  let socket = null;

  const wrapSocket = (sock) => {
    if (!sock || typeof sock.emit !== "function") return;

    const originalEmit = sock.emit;

    sock.emit = function (event, ...args) {
      const size = JSON.stringify(args).length;
      socketSent += size;
      return originalEmit.call(this, event, ...args);
    };

    sock.onAny((event, ...args) => {
      const size = JSON.stringify(args).length;
      socketReceived += size;
    });

    socket = sock;
  };

  return {
    setSocket: (sock) => wrapSocket(sock),
    getSocket: () => socket,
    setAxiosSent: (size) => {
      axiosSent += size;
    },
    setAxiosReceived: (size) => {
      axiosReceived += size;
    },
    getBandwidthUsage: () => ({
      axiosSent,
      axiosReceived,
      socketSent,
      socketReceived,
    }),
    resetUsage: () => {
      axiosSent = 0;
      axiosReceived = 0;
      socketSent = 0;
      socketReceived = 0;
    },
  };
});
