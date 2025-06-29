import React, { useEffect, useRef, useState } from "react";

// Importing Store for State 
import { callStore } from "../../store/callStore.js";
// Importing Component
import Message from "./Message";
import InputArea from "./InputArea";
import CallProfile from "../Extra/CallProfile.jsx";
import Chatheader from "./Chatheader.jsx";

export default function ChatContainer() {
  const { callModal, incomingCall } = callStore();
  
  if (callModal || incomingCall) {
    return <CallProfile />;
  }

  return (
    <>
      <div className="flex flex-col h-full w-full justify-between relative" >
        <Chatheader />
        <Message />
        <InputArea />
      </div>
    </>
  );
}
