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
    setGetModal,
  } = callStore();

  const { selectedUser } = useChatStore();
  const { socket, authUser } = authStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(callModal === "video");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // For dragging the local video
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState(null);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const pos = dragRef.current.getBoundingClientRect();
    setDragging(true);
    setRel({ x: e.pageX - pos.left, y: e.pageY - pos.top });
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.pageX - rel.x,
      y: e.pageY - rel.y,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    if (!incomingCall && !callEstablished) {
      startMedia();
      initializeMedia();
    }
    return () => stopAllMedia();
  }, []);

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

    socket.on("call-accepted", (data) => {
      if (peer) peer.signal(data.signal);
    });

    socket.on("reject-call", onReject);
    return () => socket.off("reject-call", onReject);
  }, [socket]);

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
        video: callModal === "video",
        audio: true,
      });
      mediaStreamRef.current = stream;
      setlocalStream(stream);
      if (!incomingCall) {
        setTargetSocketId(selectedUser);
      }
    } catch (err) {
      console.error("Failed to access media devices:", err);
    }
  };

  const stopAllMedia = () => {
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
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const newVideoTrack = newStream.getVideoTracks()[0];
        if (newVideoTrack) {
          mediaStreamRef.current.addTrack(newVideoTrack);
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

      {/* Full Screen Remote Stream */}
      {callModal === "video" && remoteStream && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Fallback UI if audio call */}
      {callModal === "audio" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-white">
          <img
            src={selectedUser?.profile_url}
            alt="User profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4"
          />
          <img
            src={authUser?.profile_url}
            alt="My profile"
            className="w-20 h-20 rounded-full border-4 border-gray-300 object-cover"
          />
        </div>
      )}

      {/* Draggable Local Video */}
      {callModal === "video" && localStream && (
        <div
          ref={dragRef}
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            width: "160px",
            height: "120px",
            cursor: "move",
            zIndex: 10,
          }}
          className="border border-white rounded-lg overflow-hidden shadow-md"
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Audio Call Fallback Call Status */}
      {!remoteStream && callModal === "audio" && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 px-4 py-2 text-white rounded-lg z-10">
          Calling...
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 opacity-90 z-20 hover:bg-base-100  bg-transparent  w-fit h-fit py-12 border-0 hover:border-1">
        <div className="">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-lg shadow-md w-16 border h-10 ${isMicOn ? "bg-transparent hover:bg-green-600 border-white text-white" : "bg-red-800 border-red-500 text-white"
              }`}
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </button>

          {callModal === "video" && (
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-lg shadow-md w-16 border h-10 ${isCameraOn ? "bg-transparent hover:bg-blue-600 border-white text-white" : "bg-red-800 border-red-500 text-white"
                }`}
            >
              <FontAwesomeIcon icon={faVideo} />
            </button>
          )}

          <button
            onClick={toggleSpeaker}
            className={`p-3 rounded-lg shadow-md w-16 border h-10 ${isSpeakerOn ? "bg-transparent hover:bg-purple-600 border-white text-white" : "bg-red-800 border-red-500 text-white"
              }`}
          >
            <FontAwesomeIcon icon={isSpeakerOn ? faVolumeUp : faVolumeMute} />
          </button>

          <button
            onClick={handleEndCall}
            className="bg-transparent hover:bg-red-700 text-white p-3 rounded-lg shadow-md w-16 border border-white h-10"
          >
            <FontAwesomeIcon icon={faPhoneSlash} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallProfile;
