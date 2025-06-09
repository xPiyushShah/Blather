import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const sent = new Date(timestamp);
  const diffMs = now - sent;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function Message() {
  const {
    selectedUser,
    messages,
    getMessages,
    unSubscribeMessages,
    subScribeMessages,
  } = useChatStore();
  const { authUser } = authStore();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getMessages(selectedUser._id);
    subScribeMessages();
    return () => unSubscribeMessages();
  }, [getMessages, selectedUser._id]);

  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const [messageOption, setMessageOption] = useState(null);
  const [messagedata, setMessagedata] = useState(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".message-options")) {
        setMessageOption(null); // Hide the menu if click is outside
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isNearBottom = (index) => {
    const threshold = 2;
    return messages.length - index <= threshold;
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[75%] text-gray-400 gap-4">
        <FontAwesomeIcon
          icon={faEnvelope}
          size="4x"
          className="animate-pulse"
        />
        <p className="text-x font-semibold">No messages yet...</p>
      </div>
    );
  }

  return (
    <div className="chat-show content-end scroll-smooth snap-proximity snap-y overflow-y-auto h-screen">
      <div className="flex-1 overflow-y-hidden p-4 space-y-4">
        {messages.map((msg, index) => {
          const isSender = authUser._id === msg.senderId;
          return (
            <div
              key={msg._id}
              className={`chat space-y-4 ${
                isSender ? "chat-end" : "chat-start"
              }  mb-8 relative `}
              onContextMenu={(e) => {
                e.preventDefault();
                setMessageOption((prev) => (prev === msg._id ? null : msg._id));
              }}>
              {/* <div className="chat-image avatar">
                <div className="w-8 rounded-full border">
                  <img
                    src={
                      isSender
                        ? authUser.profile_url ||
                          "https://img.daisyui.com/images/profile/demo/superperson@192.webp"
                        : selectedUser.profile_url ||
                          "https://img.daisyui.com/images/profile/demo/superperson@192.webp"
                    }
                    alt="profile pic"
                  />
                </div>
              </div> */}
              <div className="chat-footer mb-18">
                <time dateTime="" className="text-xs opacity-50 ml-1">
                  {isSender
                    ? `Sent ${formatTimeAgo(msg.createdAt)}`
                    : `Received ${formatTimeAgo(msg.createdAt)}`}
                </time>
              </div>
              <div
                className={`chat-bubble bg-base-300 text-white max-w-xs flex flex-col gap-2 p-4 relative `}>
                {msg.image && (
                  <div className="chat-image">
                    <img
                      src={msg.image}
                      alt="sent file"
                      className="sm:max-w-[200px] mb-2 rounded-md"
                    />
                  </div>
                )}
                {msg.text && <p>{msg.text}</p>}

                {messageOption === msg._id && (
                  <div
                    className={`absolute ${
                      isNearBottom(index) ? "bottom-full mb-2" : "top-full mt-2"
                    } 
                    ${
                      !isSender ? "absolute left-12" : "absolute right-12"
                    } not-only-of-type:right-0 bg-base-100 text-white border-0 shadow-md w-22 h-22 rounded z-50 text-sm message-options`}>
                    {" "}
                    <ul className="flex flex-col justify-evenly w-full h-full gap-1">
                      <li className="hover:bg-base-content px-4 py-2 cursor-pointer">
                        Star
                      </li>
                      <li className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-500">
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
