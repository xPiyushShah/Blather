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
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState(null);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const rect = dragRef.current.getBoundingClientRect();
    setDragging(true);
    setRel({ x: e.pageX - rect.left, y: e.pageY - rect.top });
    e.preventDefault();
  };

  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging || !dragRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const dragRect = dragRef.current.getBoundingClientRect();

    const newX = e.pageX - rel.x - containerRect.left;
    const newY = e.pageY - rel.y - containerRect.top;

    const clampedX = Math.max(0, Math.min(newX, containerRect.width - dragRect.width));
    const clampedY = Math.max(0, Math.min(newY, containerRect.height - dragRect.height));

    setPosition({ x: clampedX, y: clampedY });

    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, rel]);


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

    // const onReject = () => {
    //   handleEndCall();
    //   setGetModal(false);
    // };

    socket.on("call-accepted", (data) => {
      if (peer) peer.signal(data.signal);
    });

    socket.on("reject-call", (data) => { handleEndCall });
    return () => socket.off("reject-call");
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
    // stopAllMedia();
    endCall();
    setGetModal(false);
    setModal(null);
  };

  if (getModal) {
    return <CallModal />
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-black overflow-hidden flex flex-row items-center justify-center-safe"
    >

      {callModal === "video" && (
        <>
          {/* Show "Calling..." if remote stream not yet received and call not established */}
          {!remoteStream && !callEstablished && (
            <div className="absolute top-[70%] right-[40%] z-10 text-xl text-white w-56 h-fit">
              Calling to {selectedUser.first_name}  <span className="loading loading-dots loading-sm font-extralight"></span>
            </div>
          )}

          {/* Show remote video only when stream is ready */}
          {remoteStream && (
            <div>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              />
            </div>
          )}
        </>
      )}


      {/* It will show my call profile  when audio call*/}
      {callModal === "audio" && (
        <>
          <div className="flex flex-col items-center justify-center z-0 text-white relative gap-4">
            <img
              src={selectedUser?.profile_url || "https://res.cloudinary.com/dufcac38i/image/upload/v1750871808/user-3d-icon_642950-57_y7w2bq.jpg"}
              alt="User profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4"
            />
            {!callEstablished && (
              <div className="z-10 text-xl text-white w-56 h-fit">
                Calling to {selectedUser.first_name}  <span className="loading loading-dots loading-sm font-extralight"></span>
              </div>)}
          </div>
          <div
            ref={dragRef}
            onMouseDown={handleMouseDown}
            style={{
              position: "absolute",
              top: position.y,
              left: position.x,
              cursor: "move",
              zIndex: 10,
            }}
            className="absolute top-4 right-10 hover:border w-56 h-36 rounded-sm flex items-center justify-center transition-all ease-in-out delay-100 animate-pulse hover:cursor-pointer">
            <div>
              <img
                src={authUser?.profile_url || "https://res.cloudinary.com/dufcac38i/image/upload/v1750871808/user-3d-icon_642950-57_y7w2bq.jpg"}
                alt="My profile"
                className="w-20 h-20 rounded-full border-4 border-gray-300 object-cover"
              />
            </div>
            Me
          </div>
        </>
      )}

      {/* It will show my video  */}
      {callModal === "video" && localStream && (
        <div
          ref={dragRef}
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            cursor: "move",
            zIndex: 10,
          }}
          className="absolute top-4 right-10 hover:border w-56 h-36 rounded-sm flex items-center justify-center transition-all ease-in-out delay-100  hover:cursor-pointer"
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-sm"
          />
          Me
        </div>
      )}

      {/* Audio Call Fallback Call Status */}
      {/* {!remoteStream && callModal === "audio" && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 px-4 py-2 text-white rounded-lg z-10">
          Calling...
        </div>
      )} */}

      <div className="absolute  bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 opacity-90 z-20 rounded-lg bg-base-200   w-fit" style={{ padding: "12px" }}>
        {/* <div className=""> */}
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
        {/* </div> */}
      </div>
    </div>
  );
}

export default CallProfile;
