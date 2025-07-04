import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import MessageSkeleton from "./MessageSkeleton.jsx";

import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import { functionStore } from "../../store/functionStore.js";
import ImagePreview from "./extra/ImagePreview.jsx";
import CryptoJS from "crypto-js";
import Text from "../../utils/Text.jsx";


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
    deleteMessage,
    updateMessage,
    key
  } = useChatStore();
  const { starMessage, starredMessages, saveStarMessae } = functionStore();

  const { authUser, socket } = authStore();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getMessages(selectedUser._id);
    // subScribeMessages();
    // return () => unSubscribeMessages();
  }, [getMessages, selectedUser._id]);

  // useEffect(() => {
  //   getMessages(selectedUser._id);
  //   subScribeMessages();
  //   return () => unSubscribeMessages();
  // }, [getMessages, selectedUser._id, subScribeMessages, unSubscribeMessages]);

  useEffect(() => {

    if (!socket) return;

    const handleReceiveMessage = (message) => {
      // console.log("get", message);
      updateMessage(message);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage); // clean up
    };

  }, [socket]);

  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);



  const [imgSrc, setImgSrc] = useState(true);
  const [imgload, setImgload] = useState(true);
  const [openImg, setOpenImg] = useState(false);
  const [messageOption, setMessageOption] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImgload(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".message-options")) {
        setMessageOption(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleStarMessage = (messageId) => {
    const message = messages.find((msg) => msgID === messageId);
    if (!message) return;

    const isStarred = starredMessageIds.has(messageId);

    if (isStarred) {
      functionStore.setState((state) => ({
        starredMessages: state.starredMessages.filter(
          (m) => m._id !== messageId
        ),
      }));
    } else {
      functionStore.setState((state) => ({
        starredMessages: [...state.starredMessages, message],
      }));
    }

    setMessageOption(null);
    saveStarMessae(message);
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId);
    setMessageOption(null);
  };

  //text messages
  const msgCheck = (text) => {
    try {
      const bytes = CryptoJS.AES.decrypt(text, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        return text;
      }
      return decrypted;
    } catch (error) {
      return text;
    }
  };
  const isNearBottom = (index) => {
    const threshold = 2;
    return messages.length - index <= threshold;
  };


  const starredMessageIds = new Set(starredMessages.map((msg) => msgID));

  if (!messages || messages.length === 0) {
    return (
      <MessageSkeleton />
    );
  }

  return (
    <div className="chat-show content-end scroll-smooth snap-proximity snap-y overflow-y-auto h-screen">
      <div className="flex-1 overflow-y-hidden p-4 space-y-4 flex flex-col gap-4">
        {messages.map((msg, index) => {
          const isSender = authUser._id == msg.senderId;
          const msgID = index;
          const isSelected = messageOption == msgID;
          return (
            <div
              key={msgID}
              className={`chat space-y-4 ${isSender ? "chat-end" : "chat-start"
                } rounded-lg mb-8 relative ${isSelected ? "bg-[#1b34e129]" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setMessageOption((prev) => (prev === msgID ? null : msgID));
              }}>
              <div className="chat-footer mb-18 flex items-center gap-1">
                <time dateTime="" className="text-xs opacity-50 ml-1">
                  {isSender
                    ? `Sent ${formatTimeAgo(msg.createdAt)}`
                    : `Received ${formatTimeAgo(msg.createdAt)}`}
                </time>

                {starredMessageIds.has(msgID) && (
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-yellow-400 text-xs ml-1"
                    title="Starred message"
                  />
                )}
              </div>
              <div
                className={`chat-bubble bg-base-300 text-white max-w-xs w-fit flex flex-col gap-2 p-14 relative truncate`}>

                {(msg.text) && <Text msg={msgCheck(msg.text)} />}

                {msg.image && (
                  <div
                    className={`chat-image bg-base-300 ${imgload ? "skeleton" : ""
                      } w-[full] h-[full]`}>
                    <img
                      src={msg.image}
                      alt="sent file"
                      className="mb-2 rounded-md sm:max-w-[full] sm:max-h-[full] object-cover w-full cursor-pointer"
                      loading="lazy"
                      onClick={() => {
                        setOpenImg(true);
                        setImgSrc(msg.image);
                      }}
                    />
                  </div>
                )}
                {msg.audio && (
                  <audio
                    controls
                    controlsList="nodownload"
                    className="w-full  bg-base-200 rounded-md p-2">
                    <source src={msg.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {msg.video && (
                  <div className="flex justify-center items-center">
                    <video
                      controls
                      className="w-65 bg-base-200 rounded-md p-2"
                      controlsList="nodownload">
                      <source src={msg.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {openImg && msg.image && (
                  <ImagePreview
                    src={imgSrc}
                    close={() => setOpenImg(false)}
                  />
                )}

                {messageOption === msgID && (
                  <div
                    className={`absolute ${isNearBottom(index) ? "bottom-full mb-2" : "top-full mt-2"
                      } ${!isSender ? "left-12" : "right-12"
                      } bg-base-100 text-white border-0 shadow-md w-22 h-22 rounded z-50 text-sm message-options`}>
                    <ul className="flex flex-col justify-evenly w-full h-full gap-1">
                      <li
                        className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer"
                        onClick={() => handleStarMessage(msgID)}>
                        {starredMessageIds.has(msgID) ? "Unstar" : "Star"}
                      </li>
                      <li
                        className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-500"
                        onClick={() => handleDeleteMessage(msgID)}>
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