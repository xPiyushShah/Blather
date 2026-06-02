// import React, { useEffect, useRef } from "react";
// import { callStore } from "../../store/callStore.js";
// import { authStore } from "../../store/authStore.js";
// import { useChatStore } from "../../store/useChatStore.js";


// function CallModal() {
//   const localVideoRef = useRef(null);
//   const { socket, authUser ,onceUser} = authStore();
//   // const { selectedUser } = useChatStore();
//   const selectedUser = {
//     first_name: ""
//   }
//   const {
//     answerCall,
//     incomingCall,
//     setIncomingCall,
//     setGetModal,
//     callModal,
//     setlocalStream,
//   } = callStore();

//   const handleAccept = () => {
//     answerCall(incomingCall.signal, incomingCall.from, incomingCall.type);
//     setGetModal(false);
//   };

//   const handleDecline = () => {
//     socket.emit("reject-call", { to: incomingCall.from });
//     setIncomingCall(null);
//   };

//   const startMedia = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: callModal === "video" ? true : false,
//         audio: true,
//       });

//       if (localVideoRef.current && callModal === "video") {
//         localVideoRef.current.srcObject = stream;
//       }

//       setlocalStream(stream);
//     } catch (err) {
//       console.error("Failed to access media devices:", err);
//     }
//   };

//   useEffect(() => {
//     if (callModal) {
//       startMedia();
//     }
//     // onceUser();
//   }, [callModal]); 

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-sm transition-all ease-in delay-200">
//       <div className="bg-green-300  rounded-lg shadow-lg p-6 w-80 h-fit text-center relative flex flex-col gap-6 border-black border animate-slide-in-left"
//       style={{padding:"12px 22px"}}>
//         <h2 className="text-xl font-semibold mb-4 text-black capitalize"> incoming {callModal} call from </h2>

//         {callModal === "video" && (
//           <div className="relative w-full h-48 mb-4">
//             <video
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               className="absolute top-0 left-0 w-full h-full object-cover z-0"
//             />
//           </div>
//         )} 
//          {/* { && (
//           <> */}

//         <div className="flex items-center justify-center z-0 text-white relative">
//           <img
//             src={incomingCall.usData?.profile_url || "https://res.cloudinary.com/dufcac38i/image/upload/v1750871808/user-3d-icon_642950-57_y7w2bq.jpg"}
//             alt="User profile"
//             className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4"
//           />
//         </div>
//         {/* </>
//         )} */}

//         <div className="flex justify-center gap-4">
//           <button
//             onClick={handleAccept}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
//             style={{padding:"4px 8px"}}>
//             Accept
//           </button>
//           <button
//             onClick={handleDecline}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
//             style={{padding:"4px 8px"}}>
//             Reject
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CallModal;

import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPhoneSlash,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faMessage,
  faSpellCheck
} from '@fortawesome/free-solid-svg-icons'

import { useChatStore } from "../../store/useChatStore.js";
import { useCallStore } from "../../store/useCallStore.js";

const ProfileAvatar = React.lazy(() => import("../Avatar/ProfileAvatar.jsx"));

function CallScreen() {

  const {
    initializeMedia,
    localStream,
    remoteStream,
    endCall,
    callType
  } = useCallStore();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!callType);

  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { selectedUser } = useChatStore();

  useEffect(() => {
    initializeMedia();
  }, []);

  useEffect(() => {
    if (!remoteVideoRef.current) return;
    if (!remoteStream) return;
    if (!callType) return;

    remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream, callType]);

  useEffect(() => {
    if (!localStream) return;

    if (callType) {
      setIsVideoOff(false);

      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }

      localStream.getVideoTracks().forEach(track => {
        track.enabled = true;
      });
    } else {
      setIsVideoOff(true);

      localStream.getVideoTracks().forEach(track => {
        track.enabled = false;
      });
    }

  }, [localStream, callType]);

  const handleMuteToggle = () => {
    if (!localStream) return;

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !newMutedState;
    });
  };

  const handleVideoToggle = () => {
    if (!localStream) return;

    const newVideoState = !isVideoOff;
    setIsVideoOff(newVideoState);

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !newVideoState;
    });

    if (videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  };

  const handleEndCall = async () => {
    await endCall();
  }

  return (
    <div className='absolute inset-0 z-[999] w-full h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-black flex items-center justify-center'>

      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

      <div className='relative z-10 flex flex-col items-center justify-center w-full h-full'>

        {callType && remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className='absolute inset-0 w-full h-full object-cover'
          />
        )}

        <div className='absolute bottom-28 right-6 z-50 w-[320px] h-[180px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 shadow-2xl backdrop-blur-xl flex items-center justify-center transition-all duration-300 ease-in-out opacity-100 translate-y-0 scale-100'>

          <div className='w-full h-full bg-black/40 flex items-center justify-center text-white text-xs tracking-wide'>

            {callType && !isVideoOff && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className='w-full h-full object-cover'
              />
            )}

            {(!callType || isVideoOff) && (
              <div className="flex items-center justify-center gap-6 w-full h-full flex-1 opacity-60">

                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-2xl">
                  <FontAwesomeIcon
                    icon={isMuted ? faMicrophoneSlash : faMicrophone}
                  />
                </div>

                <div className="w-[1px] h-16 bg-gray-400/40"></div>

                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-2xl">
                  <FontAwesomeIcon
                    icon={isVideoOff ? faVideoSlash : faVideo}
                  />
                </div>

              </div>
            )}

          </div>
        </div>

        {(!remoteStream || !callType) && (
          <div className='flex flex-col items-center justify-center gap-4'>

            <div className='w-32 h-32 flex items-center justify-center text-5xl font-bold text-white flex-1'>
              <ProfileAvatar user={selectedUser} />
            </div>

            <div className='text-center'>
              <h1 className='text-white text-3xl font-semibold tracking-wide'>
                {selectedUser.first_name} {selectedUser.last_name}
              </h1>

              <p className='text-gray-300 text-sm mt-2'>
                Calling...
              </p>
            </div>
          </div>
        )}

        <div
          style={{ padding: "6px 22px" }}
          className='absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-5 bg-white/10 border border-white/10 backdrop-blur-xl px-6 py-4 rounded-full shadow-2xl'
        >

          <button
            onClick={handleMuteToggle}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
                        ${isMuted
                ? 'bg-green-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
          >
            <FontAwesomeIcon
              icon={isMuted ? faMicrophoneSlash : faMicrophone}
            />
          </button>

          {callType && (
            <button
              onClick={handleVideoToggle}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
                            ${isVideoOff
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
            >
              <FontAwesomeIcon
                icon={isVideoOff ? faVideoSlash : faVideo}
              />
            </button>
          )}

          <button
            onClick={handleEndCall}
            className='w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-500/30 transition-all duration-300'
          >
            <FontAwesomeIcon icon={faPhoneSlash} />
          </button>

          <button className='w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 pointer-events-none opacity-20'>
            <FontAwesomeIcon icon={faSpellCheck} />
          </button>

          <button className='w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 pointer-events-none opacity-20'>
            <FontAwesomeIcon icon={faMessage} />
          </button>

        </div>

      </div>
    </div>
  )
}

export default CallScreen
