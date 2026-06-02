import React, { useEffect, useRef, useState, Suspense } from "react";

// Importing Store for State 
import { callStore } from "../../store/callStore.js";
// Importing Component
// import Message from "./Message";
import InputArea from "./InputArea";
import CallProfile from "../Extra/CallProfile.jsx";
import Chatheader from "./Chatheader.jsx";

import MessageLoading from "./Blank/MessageLoading.jsx";
import { useChatStore } from "../../store/useChatStore.js";
const Message = React.lazy(() => import("./Message"));

export default function ChatContainer() {
  const { callModal, incomingCall } = callStore();

  if (callModal || incomingCall) {
    return <CallProfile />;
  }

  const { MyFrnd } = useChatStore();

  return (
    <>
      <div className="flex flex-col h-full w-full justify-between relative" >
        <Chatheader />
        <Suspense fallback={<MessageLoading />}>
          <Message />
        </Suspense>
        { MyFrnd &&
          <InputArea />
        }
      </div>
    </>
  );
}
