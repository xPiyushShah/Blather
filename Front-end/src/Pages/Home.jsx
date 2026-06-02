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

    socket.on("reject-call", (data) => { endCall() });6

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("reject-call");
    };
  }, [socket]);

  return (
    <div className="main-root bg-[var(--main-bg)] *:select-none">
      <div className="hidden sm:flex w-full max-h-svh h-full absolute text-white flex-row overflow-hidden bg-[var(--main-bg)]" >
        <div className="w-full h-full flex flex-row align-center overflow-hidden">
          <LeftBox />
          <SideBox />
        </div>
      </div>
    </div>
  );
};

export default Home;
