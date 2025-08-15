import React, { useState } from 'react'
import { useChatStore } from '../../store/useChatStore';
import { callStore } from '../../store/callStore';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faPhoneSlash,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

function CallButton() {
    const { setModal, callModal, endCall, setGetModal } = callStore();
    const [isCameraOn, setIsCameraOn] = useState(callModal === "video");
    const [isMicOn, setIsMicOn] = useState(true);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);

    const handleEndCall = () => {
        endCall();
        setGetModal(false);
        setModal(null);
    };

    const toggleSpeaker = () => {
        setIsSpeakerOn((prev) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.volume = !prev ? 1 : 0;
            }
            return !prev;
        });
    };
    const toggleCamera = async () => {
        if (!mediaStreamRef.current) return;
        const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
        handleMediaToggle(true, videoTrack?.enabled);

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
        handleMediaToggle(false, audioTrack.enabled);
    };

    return (
        <>
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
        </>
    )
}

export default CallButton
