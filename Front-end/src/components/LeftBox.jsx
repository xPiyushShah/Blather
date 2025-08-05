import React, { useState, useEffect } from "react";

import Profile from "./Profile/Profile";

import ChatContainer from "./Messages/ChatContainer";
import BlankMessage from "./Messages/BlankMessage";
import { useChatStore } from "../store/useChatStore";
import CallProfile from "./Extra/CallProfile";
import { callStore } from "../store/callStore";
import { functionStore } from "../store/functionStore";

const  LeftBox = () => {
  const { selectedUser } = useChatStore();
  const { isProfile , isRoom , usrID} = functionStore();
  const { getModal,callEstablished} = callStore();

  return (
    <div className="flex flex-col max-h-full w-4/5  bg-[rgba(0,0,0,0.6)]  border-r-[1px] border-r-[#dddddd35]">
      {!isProfile  && (
        <>
          {!selectedUser && (!getModal && !callEstablished) ? <BlankMessage /> : <ChatContainer />}
        </>
      )}
      {isProfile && <Profile />}

    </div>
  );
};

export default LeftBox;
