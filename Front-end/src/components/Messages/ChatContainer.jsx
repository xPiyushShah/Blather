import React from "react";
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

export default function ChatContainer() {
  const { selectedUser, setSelctedUser } = useChatStore();
  const { onlineUser } = authStore();
  const { callModal, setModal, incomingCall } = callStore();

  // Show CallProfile if audio or video call is active
  if (callModal || incomingCall) {
    return <CallProfile />;
  }

  return (
    <div className="flex flex-col h-screen w-full justify-between ">
      <div className="flex flex-row justify-between w-full border-b-[1px] border-b-[#dddddd35]  align-center text-center header-lest">
        <div
          className={`hidden md:flex mt-15 w-20 rounded-full hover:cursor-pointer  avatar  align-center justify-center text-center
           ${onlineUser.includes(selectedUser._id)  ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}>
          {selectedUser.profile_url ? (
            <img
              alt={selectedUser.first_name}
              src={selectedUser.profile_url}
              className="object-cover "
            />
          ) : (
            <ProfileAvatar onGen={selectedUser} />
          )}
        </div>
        <div className="flex items-center  align-center text-center opacity-85  ">
          {`${selectedUser.first_name} ${selectedUser.last_name}`}
        </div>
        <div className="lest-3 lest-apply">
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
      </div>
      <Message />
      <InputArea />
    </div>
  );
}
