import React, { useEffect, useState } from 'react'

import { useFunction } from '../store/useFunction.js';
import { useAuthStore } from '../store/authStore.js';
import { useCallStore } from '../store/useCallStore.js';

const MainScreen = React.lazy(() => import('../components/screens/MainScreen.jsx'));
const CallScreen = React.lazy(() => import('../components/screens/CallScreen.jsx'));
const IncomingCall = React.lazy(() => import('../components/Calling/IncomingCallModal.jsx'));


// hook - bg color
import { getRandomGradient } from '../hooks/color/bgColor.js';
function Home() {

  const [bgGradient, setBgGradient] = useState(getRandomGradient("matrix"));
  const { socket } = useAuthStore();
  const { endCall, peer, setIncomingCall, isIncomingCall, setCallType, isCallScreenOpen } = useCallStore();





  useEffect(() => {
    if (!socket) return;

    socket.off("incoming-call");
    socket.off("call-accepted");
    socket.off("reject-call");

    socket.on("incoming-call", (data) => {
      // console.log("incoming-call", data);

      setIncomingCall({
        data,
        isIncomingCall: true,
      });

      setCallType(data.type);
    });

    socket.on("call-accepted", (data) => {
      // console.log("call-accepted", data);

      const peer = useCallStore.getState().peer;

      if (peer) {
        peer.signal(data.signal);
      }
    });

    socket.on("reject-call", () => {
      // console.log("reject-call");

      useCallStore.getState().endCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("reject-call");
    };
  }, [socket]);

  return (
    // <div className="min-h-screen w-full select-none relative  
    //   bg-[linear-gradient(-45deg,#1a0000,#3b0a0a,#111111,#2a0f0f)]  bg-[length:400%_400%]  animate-[gradientMove_15s_ease_infinite]
    // ">
    <div className={`min-h-screen w-full select-none relative overflow-hidden ${bgGradient} bg-[length:400%_400%] animate-[gradientFlow_25s_cubic-bezier(0.22,1,0.36,1)_infinite]`}>

      {/* Glass blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/5 pointer-events-none" />

      {/* optional extra glow layer */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* content */}
      <div className="relative z-10">
        <MainScreen />
        {isIncomingCall && <IncomingCall />}
        {isCallScreenOpen && <CallScreen />}
      </div>

    </div>
  )
}

export default Home
