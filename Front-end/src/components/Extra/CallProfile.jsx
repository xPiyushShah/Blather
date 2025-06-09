import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faPhoneSlash,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { callStore } from "../../store/callStore.js";
import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import CallModal from "./CallModal";

function CallProfile() {
  const {
    localStream,
    initializeMedia,
    makeCall,
    endCall,
    callModal,
    remoteStream,
    setModal,
    setlocalStream,
    setTargetSocketId,
    callEstablished,
    incomingCall,
    getModal,
    peer,
    setGetModal
  } = callStore();

  const { selectedUser } = useChatStore();
  const { socket } = authStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(callModal === "video");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  useEffect(() => {
    if (!incomingCall && !callEstablished) {
      startMedia();
      initializeMedia();
    }
    return () => stopAllMedia();
  }, []);

  // Call media setup for receiver
  useEffect(() => {
    if (incomingCall && callEstablished) {
      setModal(incomingCall.type);
      initializeMedia();
      startMedia();
    }
    return () => stopAllMedia();
  }, [incomingCall, callEstablished]);

  useEffect(() => {
    if (!socket) return;

    const onReject = () => {
      handleEndCall();
      setGetModal(false);
    };

    // socket.off("call-accepted");
    socket.on("call-accepted", (data) => {
      if (peer) peer.signal(data.signal);
    });

    socket.on("reject-call", onReject);
    return () => socket.off("reject-call", onReject);
  }, [socket]);

  // Attach remote stream to remote video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callModal === "video" ? true : false,
        audio: true,
      });

      // mediaStreamRef.current.srcObject = stream;

      // setlocalStream(stream);
      if (!incomingCall) {
        setTargetSocketId(selectedUser);
      }
    } catch (err) {
      console.error("Failed to access media devices:", err);
    }
  };

  const stopAllMedia = () => {
    // if (localVideoRef.current) {
    //   localVideoRef.current.getTracks().forEach((track) => track.stop());
    //   localVideoRef.current = null;
    // }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const toggleCamera = async () => {
    if (!mediaStreamRef.current) return;

    const videoTrack = mediaStreamRef.current.getVideoTracks()[0];

    if (isCameraOn && videoTrack) {
      videoTrack.stop();
      setIsCameraOn(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const newVideoTrack = newStream.getVideoTracks()[0];
        if (newVideoTrack) {
          mediaStreamRef.current.addTrack(newVideoTrack);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStreamRef.current;
          }
          setIsCameraOn(true);
        }
      } catch (err) {
        console.error("Error enabling camera:", err);
      }
    }
  };

  const toggleMic = () => {
    const audioTrack = mediaStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.volume = !prev ? 1 : 0;
      }
      return !prev;
    });
  };

  const handleEndCall = () => {
    stopAllMedia();
    endCall();
    setModal(null);
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      {getModal && <CallModal />}
      

      {/* Local video stream (full screen) */}
      {callModal === "video" && (
        <>
          <video
            ref={localVideoRef || mediaStreamRef}
            autoPlay
            playsInline
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />
          <p className="z-99 relative left-6 font-bold ">Me</p>
        </>
      )}

      {/* Audio call profile image */}
      {callModal !== "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
          <img
            src={selectedUser?.profile_url}
            alt="User profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
        </div>
      )}

      {/* Remote stream (picture-in-picture style) */}
      {remoteStream && callModal === "video" ? (
        <div className="flex w-64 h-36 border border-white rounded-lg absolute top-4 right-4 z-10 overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="flex w-64 h-36 border border-white rounded-lg absolute top-4 right-4 z-10 overflow-hidden">
          <p className="absolute top-4 left-4 z-10 bg-black bg-opacity-60 text-white px-4 py-2 rounded">
            Calling...
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 opacity-90 z-10">
        <button
          onClick={toggleMic}
          className={`p-3 rounded-lg shadow-md w-16 border h-10 ${
            isMicOn
              ? "bg-transparent hover:bg-green-600 border-white text-white"
              : "bg-red-800 border-red-500 text-white"
          }`}>
          <FontAwesomeIcon icon={faMicrophone} />
        </button>

        {callModal === "video" && (
          <button
            onClick={toggleCamera}
            className={`p-3 rounded-lg shadow-md w-16 border h-10 ${
              isCameraOn
                ? "bg-transparent hover:bg-blue-600 border-white text-white"
                : "bg-red-800 border-red-500 text-white"
            }`}>
            <FontAwesomeIcon icon={faVideo} />
          </button>
        )}

        <button
          onClick={toggleSpeaker}
          className={`p-3 rounded-lg shadow-md w-16 border h-10 ${
            isSpeakerOn
              ? "bg-transparent hover:bg-purple-600 border-white text-white"
              : "bg-red-800 border-red-500 text-white"
          }`}>
          <FontAwesomeIcon icon={isSpeakerOn ? faVolumeUp : faVolumeMute} />
        </button>

        <button
          onClick={handleEndCall}
          className="bg-transparent hover:bg-red-700 text-white p-3 rounded-lg shadow-md w-16 border border-white h-10">
          <FontAwesomeIcon icon={faPhoneSlash} />
        </button>
      </div>
    </div>
  );
}

export default CallProfile;
