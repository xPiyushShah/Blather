import React, { useEffect, useRef } from "react";
import { callStore } from "../../store/callStore.js";
import { authStore } from "../../store/authStore.js";
import { useChatStore } from "../../store/useChatStore.js";


function CallModal() {
  const localVideoRef = useRef(null);
  const { socket, authUser ,onceUser} = authStore();
  // const { selectedUser } = useChatStore();
  const selectedUser = {
    first_name: ""
  }
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
    // onceUser();
  }, [callModal]); 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-sm transition-all ease-in delay-200">
      <div className="bg-green-300  rounded-lg shadow-lg p-6 w-80 h-fit text-center relative flex flex-col gap-6 border-black border animate-slide-in-left"
      style={{padding:"12px 22px"}}>
        <h2 className="text-xl font-semibold mb-4 text-black capitalize"> incoming {callModal} call from </h2>

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
         {/* { && (
          <> */}

        <div className="flex items-center justify-center z-0 text-white relative">
          <img
            src={incomingCall.usData?.profile_url || "https://res.cloudinary.com/dufcac38i/image/upload/v1750871808/user-3d-icon_642950-57_y7w2bq.jpg"}
            alt="User profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4"
          />
        </div>
        {/* </>
        )} */}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
            style={{padding:"4px 8px"}}>
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
            style={{padding:"4px 8px"}}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallModal;
