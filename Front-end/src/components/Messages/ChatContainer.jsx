import React, { useState, useEffect } from "react";
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
import ContextMenu from "../../utils/contextMenu.jsx";

export default function ChatContainer() {
  const [context, setContext] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  const { selectedUser, setSelctedUser } = useChatStore();
  const { onlineUser } = authStore();
  const { callModal, setModal, incomingCall } = callStore();


  // Hide context menu on click elsewhere
  useEffect(() => {
    const handleClick = () => setContext(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  if (callModal || incomingCall) return <CallProfile />;

  return (
    <div
      className="relative flex flex-col h-full w-full justify-between"
      onContextMenu={(e) => {
        e.preventDefault();
        setContext(true);
        setContextPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      }}
    >
      {/* Header */}
      <div className="flex flex-row justify-between w-full border-b border-[#dddddd35] min-h-[40px] max-h-[72px] items-center px-4">
        {/* Avatar */}
        <div
          className={`hidden md:flex w-10 h-10 rounded-full hover:cursor-pointer avatar items-center justify-center ${
            onlineUser.includes(selectedUser._id)
              ? "avatar-online"
              : "avatar-offline"
          }`}
        >
          {selectedUser.profile_url ? (
            <img
              alt={selectedUser.first_name}
              src={selectedUser.profile_url}
              className="object-cover rounded-full w-8 h-8"
            />
          ) : (
            <ProfileAvatar onGen={selectedUser} />
          )}
        </div>

        <div className="flex items-center opacity-85">
          {selectedUser.first_name} {selectedUser.last_name}
        </div>

        <div className="flex gap-3">
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => setSelctedUser(null)}
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faVideoCamera}
            onClick={() => setModal("video")}
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faPhone}
            onClick={() => setModal("audio")}
            className="cursor-pointer"
          />
        </div>
      </div>

      <Message />

      <InputArea
        onContextMenu={(e) => {
          e.preventDefault();
          setContext(true);
          setContextPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        }}
      />

      {context && <ContextMenu x={contextPos.x} y={contextPos.y} />}
    </div>
  );
}
