import React, { useEffect, useRef } from "react";
import { callStore } from "../../store/callStore.js";
import { authStore } from "../../store/authStore.js";

function CallModal() {
  const localVideoRef = useRef(null);
  const { socket } = authStore();
  const {
    answerCall,
    incomingCall,
    setIncomingCall,
    setGetModal,
    callModal,
    setlocalStream,
  } = callStore();

  const handleAccept = () => {
    answerCall(incomingCall.signal, incomingCall.from, incomingCall.type);
    setGetModal(false);
  };

  const handleDecline = () => {
    socket.emit("reject-call", { to: incomingCall.from });
    setIncomingCall(null);
  };

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callModal === "video" ? true : false,
        audio: true,
      });

      if (localVideoRef.current && callModal === "video") {
        localVideoRef.current.srcObject = stream;
      }

      setlocalStream(stream);
    } catch (err) {
      console.error("Failed to access media devices:", err);
    }
  };

  useEffect(() => {
    if (callModal) {
      startMedia();
    }
  }, [callModal]); // ensure this only runs when `callModal` is set

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center relative">
        <h2 className="text-xl font-semibold mb-4">Incoming Call...</h2>

        {callModal === "video" && (
          <div className="relative w-full h-48 mb-4">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
          </div>
        )}
        {callModal !== "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
            <img
              src={selectedUser?.profile_url}
              alt="User profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallModal;
