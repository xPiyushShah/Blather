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
const EngineLoading = React.lazy(() => import("../Calling/EngineLoading.jsx"));

function CallScreen() {

    const {
        initializeMedia,
        localStream,
        remoteStream,
        endCall,
        callType, callInitializer, localStreamLoading, isCallEsablished
    } = useCallStore();

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(!callType);

    const videoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const remoteAudioRef = useRef(null);

    const { selectedUser } = useChatStore();

    useEffect(() => {
        if (!remoteStream) return;

        if (callType) {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        } else {
            if (remoteAudioRef.current) {
                console.log("Setting remote audio stream", remoteStream);
                remoteAudioRef.current.srcObject = remoteStream;
                remoteAudioRef.current.play()
                    .catch(err => console.log(err));
            }
        }
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
        <div className=" absolute inset-0 z-[999] flex items-center justify-center  bg-black/50 backdrop-blur-md animate-[fadeIn_0.3s_ease-out] " >
            <div className=" w-[85%] h-[85%] rounded-2xl bg-[#111]  border border-[#ffffff20] shadow-2xl overflow-hidden animate-[zoomIn_0.3s_ease-out] " >
                <div className='absolute inset-0 z-[999] w-full h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-black flex items-center justify-center'>

                    <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

                    {localStreamLoading && (<EngineLoading callType={callType} />)}

                    <div className='relative z-10 flex flex-col items-center justify-center w-full h-full'>

                        {callType && remoteStream && (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className='absolute inset-0 w-full h-full object-cover'
                            />
                        )}

                        {/* {!callType && ()} */}
                        <audio
                            ref={remoteAudioRef}
                            autoPlay
                            playsInline
                        />


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

                                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-2xl">
                                            <FontAwesomeIcon
                                                icon={isMuted ? faMicrophoneSlash : faMicrophone}
                                            />
                                        </div>

                                        <div className="w-[1px] h-16 bg-gray-400/40"></div>

                                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-2xl">
                                            <FontAwesomeIcon
                                                icon={isVideoOff ? faVideoSlash : faVideo}
                                            />
                                        </div>

                                    </div>
                                )}

                            </div>
                        </div>
                        {/* hdidng bwlow block due do whenver its icomming call there is no selected user  */}

                        {(!callType) && (
                            <div className='flex flex-col items-center justify-center gap-4'>

                                <div className='w-32 h-32 flex items-center justify-center text-5xl font-bold text-white flex-1'>
                                    <ProfileAvatar user={selectedUser} />
                                </div>

                                <div className='text-center'>
                                    <h1 className='text-white text-3xl font-semibold tracking-wide'>
                                        {selectedUser.first_name} {selectedUser.last_name}
                                    </h1>

                                    <p className='text-gray-300 text-sm mt-2'>
                                        {!isCallEsablished ?? "Calling.."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* button's of call screens */}
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

                            {/* {callType && ()} */}
                            <button
                                onClick={handleVideoToggle}
                                disabled={!callType}
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
            </div>
        </div>

    )
}

export default CallScreen