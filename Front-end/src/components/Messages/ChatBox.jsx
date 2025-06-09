import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideoCamera,
  faPhone,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Message from "./Message";
import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import ProfileAvatar from "../ProfileAvatar";
import InputArea from "./InputArea";
export default function ChatBox() {
  const { selectedUser, setSelctedUser } = useChatStore();
  const { onlineUser } = authStore();
  return (
    <>
      <div className="header-lest ">
        <div
          className={`lest-1 lest-apply avatar ${
            onlineUser.includes(selectedUser.id)
              ? "avatar-online"
              : "avatar-offline"
          }`}>
          <div className="w-10 rounded-full ">
            <img
              alt={`${selectedUser.first_name}`}
              src={
                selectedUser.profile_url ? (
                  selectedUser.profile_url
                ) : (
                  <ProfileAvatar onGen={selectedUser} />
                )
              }
            />
          </div>
        </div>
        <div className="lest-2 lest-apply">{`${selectedUser.first_name} ${selectedUser.last_name}`}</div>
        <div className="lest-3 lest-apply">
          <div className="opt rounded-r-lg">
            <FontAwesomeIcon
              icon={faXmark}
              onClick={() => setSelctedUser(null)}
            />
          </div>
          <div className="opt ">
            <FontAwesomeIcon icon={faVideoCamera} />
          </div>
          <div className="opt rounded-l-lg">
            <FontAwesomeIcon icon={faPhone} />
          </div>
        </div>
      </div>
      <Message />
      <InputArea />
    </>
  );
}
