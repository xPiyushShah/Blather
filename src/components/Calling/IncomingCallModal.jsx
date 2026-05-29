// import React , { useRef }from 'react'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPhoneSlash, faPhone } from '@fortawesome/free-solid-svg-icons'

// import { useCallStore } from "../../store/useCallStore.js";

// function IncomingCallModal() {
//     const localVideoRef = useRef(null);
//     const { incomingCallData, endCall, isIncomingCall, setIncomingCall, setCallType,answerCall, setCallScreen, initializeMedia, setLocalStream } = useCallStore();
//     // const { callerName, callType } = incomingCallData || {};

//     const hangupCall = async () => {
//         setIncomingCall({ data: null, isIncomingCall: false });
//         await endCall();
//     }
//     const startMedia = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: incomingCallData.type,
//                 audio: true,
//             });

//             if (localVideoRef.current) {
//                 localVideoRef.current.srcObject = stream;
//             }

//             setLocalStream(stream);
//         } catch (err) {
//             console.error("Failed to access media devices:", err);
//         }
//     };


//     const acceptCall = async () => {
//         // 1. have to intialize media on call accept by me 
//         // 2. in incommingcall varriable we have already data from  caller so we can directly use that data to answer the call
//         //3. after accepting the call we have to open the call screen for that we can set the call screen state to true
//         await setCallType(incomingCallData.type); //pehel ye call type chhiye next tab hoga
//         // await initializeMedia();
//         startMedia();
//         setCallScreen();
//         answerCall(incomingCallData.signal, incomingCallData.from, incomingCallData.type);
//     }


//     return (
//         <div className=" absolute bottom-4 flex-col gap-4 right-2 z-[999] w-[320px] h-[120px] rounded-2xl  bg-[#111827]/90 border border-white/10 backdrop-blur-xl shadow-2xl animate-[slideIn_0.5s_ease-out] flex items-center justify-center" >
//             <h1 className="text-white text-lg font-semibold">
//                 Incoming Call...
//             </h1>
//             <div className="mt-7 flex items-center gap-8 flex-row-reverse">

//                 {/* Reject */}
//                 <button className="group flex  h-12 w-12 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-90 hover:bg-red-600 active:scale-95"
//                     onClick={hangupCall}>
//                     <FontAwesomeIcon
//                         icon={faPhone}
//                         className="text-xl text-white rotate-[135deg]"
//                     />
//                 </button>

//                 {/* Accept */}
//                 <button onClick={acceptCall} className="group flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-90 hover:bg-green-600 active:scale-95">
//                     <FontAwesomeIcon
//                         icon={faPhone}
//                         className="text-xl text-white"
//                     />
//                 </button>

//             </div>
//         </div>
//     )
// }

// export default IncomingCallModal
import React, { useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneSlash, faPhone } from "@fortawesome/free-solid-svg-icons";

import { useCallStore } from "../../store/useCallStore.js";

function IncomingCallModal() {
    const localVideoRef = useRef(null);

    const {
        incomingCallData,
        endCall,
        setIncomingCall,
        setCallType,
        answerCall,
        setCallScreen,
        initializeMedia,
    } = useCallStore();

    const hangupCall = async () => {
        setIncomingCall({ data: null, isIncomingCall: false });
        endCall();
    };

    const startMedia = async () => {
        try {
            if (!incomingCallData) return null;

            const stream = await navigator.mediaDevices.getUserMedia({
                video: incomingCallData.type || false,
                audio: true,
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            return stream;
        } catch (err) {
            console.error("Failed to access media devices:", err);
            return null;
        }
    };

    const acceptCall = async () => {
        if (!incomingCallData) return;

        setCallType(incomingCallData.type);

        // const stream = await startMedia();

        // if (!stream) return;

        // setLocalStream(stream);
        initializeMedia(false); 
        setCallScreen();

        answerCall(
            incomingCallData.signal,
            incomingCallData.from,
            incomingCallData.type
        );
    };

    return (
        <div className=" absolute bottom-4 flex-col gap-4 right-2 z-[999] w-[320px] h-[120px] rounded-2xl  bg-[#111827]/90 border border-white/10 backdrop-blur-xl shadow-2xl animate-[slideIn_0.5s_ease-out] flex items-center justify-center" >
            <h1 className="text-white text-lg font-semibold">
                Incoming {incomingCallData.type ? "Video" : "Audio" } Call
            </h1>

            <div className="mt-7 flex items-center gap-8 flex-row-reverse">

                <button
                    className="group flex  h-12 w-12 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-90 hover:bg-red-600 active:scale-95"
                    onClick={hangupCall}
                >
                    <FontAwesomeIcon
                        icon={faPhone}
                        className="text-xl text-white rotate-[135deg]"
                    />
                </button>

                <button
                    onClick={acceptCall}
                    className="group flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-90 hover:bg-green-600 active:scale-95"
                >
                    <FontAwesomeIcon
                        icon={faPhone}
                        className="text-xl text-white"
                    />
                </button>

            </div>
        </div>
    );
}

export default IncomingCallModal;