import React, { useState, useEffect } from "react";
import "../assets/Css/Home.css";
import LeftBox from "../components/LeftBox";
import SideBox from "../components/SideBox";
import { callStore } from "../store/callStore";
import { authStore } from "../store/authStore";
import Loader from "../utils/Loader"

const Home = () => {
  const { setIncomingCall, setGetModal, setModal, setPeer, endCall } = callStore();
  const { socket } = authStore();

  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-call", (data) => {
      setIncomingCall(data);
      setModal(data.type);
      setGetModal(true);
    });

    socket.off("call-accepted");
    socket.on("call-accepted", (data) => {
      setPeer(data.signal);
      const peer = callStore.getState().peer;
      if (peer) peer.signal(data.signal);
    });

    socket.on("reject-call", (data) => { endCall() });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("reject-call");
    };
  }, [socket]);

  return (
    <div className="main-root ">
      <div className="hidden sm:flex w-full max-h-svh h-full absolute text-white flex-row overflow-hidden" >
        <div className="w-full h-full flex flex-row align-center overflow-hidden">
          <LeftBox />
          <SideBox />
        </div>
      </div>
      {/* Only visible on screens < 640px */}
      <div className="flex  flex-col  gap-6 sm:hidden justify-center items-center h-screen bg-black text-white text-center px-4">
        <Loader />
        {/* <p className="text-lg font-semibold">Not available on this device</p>
        <p className="text-lg font-semibold">Try in Mobile application</p> */}
      </div>
    </div>
  );
};

export default Home;
