import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideoCamera,
  faPhone,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Message from "./Message";
import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import { callStore } from "../../store/callStore.js";
import ProfileAvatar from "../ProfileAvatar";
import InputArea from "./InputArea";
import CallProfile from "../Extra/CallProfile.jsx";
import { functionStore } from "../../store/functionStore.js";
import ContextMenu from "../../utils/contextMenu.jsx";

export default function ChatContainer() {
  const [context, setContext] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  const { selectedUser, setSelctedUser } = useChatStore();
  const { onlineUser } = authStore();
  const { callModal, setModal, incomingCall } = callStore();
  const { setUsrId } = functionStore();

  // Show CallProfile if audio or video call is active
  if (callModal || incomingCall) {
    return <CallProfile />;
  }

  return (
    <div className="flex flex-col h-full w-full justify-between ">
      <div
        className="relative flex flex-row justify-between w-full border-b-[1px] border-b-[#dddddd35] max-h-24 align-center text-center header-lest"
        onContextMenu={(e) => {
          e.preventDefault();
          setContext(true);
          setContextPos({ x: e.pageX, y: e.pageY });
        }} >
        <div
          className={`hidden md:flex mt-15 w-20 rounded-full hover:cursor-pointer  avatar  align-center justify-center text-center
           ${onlineUser.includes(selectedUser._id)
              ? "avatar-online"
              : "avatar-offline"
            }
          `}>
          {selectedUser.profile_url ? (
            <img
              alt={selectedUser.first_name}
              src={selectedUser.profile_url}
              className={`object-cover mask mask-squircle rounded-full w-8 h-8 ${!selectedUser ? "skeleton" : ""}`}
            />
          ) : (
            <ProfileAvatar onGen={selectedUser} />
          )}
        </div>
        <div className={`flex items-center  align-center text-center opacity-85 ${!selectedUser ? "skeleton" : ""}`}>
          {`${selectedUser.first_name} ${selectedUser.last_name}`}
        </div>
        <div className={`lest-3 lest-apply ${!selectedUser ? "skeleton" : ""}`}>
          <div className="opt rounded-r-lg">
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => setSelctedUser(null)}
            />
          </div>
          <div className="opt">
            <FontAwesomeIcon
              icon={faVideoCamera}
              onClick={() => setModal("video")}
            />
          </div>
          <div className="opt rounded-l-lg">
            <FontAwesomeIcon icon={faPhone} onClick={() => setModal("audio")} />
          </div>
        </div>
        {context && <ContextMenu x={contextPos.x} y={contextPos.y} />}
      </div>
      <Message />
      <InputArea
        onContextMenu={(e) => {
          e.preventDefault();
          setContext(true);
        }}
      />
    </div>
  );
}
