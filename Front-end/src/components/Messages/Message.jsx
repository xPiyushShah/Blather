import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

//store for management
import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import { functionStore } from "../../store/functionStore.js";

//helper function 
import { formatTimeAgo, msgCheck, isNearBottom, getMessageId } from "../../helper/messages.js"

//components
import ImagePreview from "./extra/ImagePreview.jsx";
import Text from "../../utils/Text.jsx";
import ContextMenu from "../../utils/contextMenu.jsx";
import MessageSkeleton from "./MessageSkeleton.jsx";



export default function Message() {
  const {
    selectedUser,
    messages,
    getMessages,
    unSubscribeMessages,
    subScribeMessages,
    deleteMessage,
    isMessageLoading,
    isTyping,
  } = useChatStore();
  const { starredMessages, saveStarMessae,loadStarMessages } = functionStore();
  const { authUser } = authStore();

  const bottomRef = useRef(null);
  const [context, setContext] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const [messageOption, setMessageOption] = useState(null);
  const [imgSrc, setImgSrc] = useState(true);
  const [imgload, setImgload] = useState(true);
  const [openImg, setOpenImg] = useState(false);



  useEffect(() => {
    const handleClick = () => setContext(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getMessages(selectedUser._id);
    subScribeMessages();
    return () => unSubscribeMessages();
  }, [getMessages, selectedUser._id, subScribeMessages, unSubscribeMessages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImgload(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const starredMessageIds = new Set(
    starredMessages.map((msg, idx) => getMessageId(msg, idx))
  );

  const handleStarMessage = (messageId) => {
    const message = messages.find((msg, index) => getMessageId(msg, index) === messageId);
    if (!message) return;

    const isStarred = starredMessageIds.has(messageId);

    loadStarMessages();
    functionStore.setState((state) => ({
      starredMessages: isStarred
        ? state.starredMessages.filter((m, i) => getMessageId(m, i) !== messageId)
        : [...state.starredMessages, message],
    }));
    localStorage.setItem("st_message", JSON.stringify(message));

    saveStarMessae(message);
    setMessageOption(null);
  };
  useEffect(() => {
    loadStarMessages();
  }, []);

  const handleDeleteMessage = (messageId) => {
    const message = messages.find((msg, index) => getMessageId(msg, index) === messageId);
    if (message && message._id) {
      deleteMessage(message._id);
    }
    setMessageOption(null);
  };

  if (isMessageLoading) {
    return (
      <div className="flex flex-row items-end justify-center h-full mb-12">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return <MessageSkeleton />;
  }

  return (
    <>
      <div
        className="chat-show content-end scroll-smooth snap-y overflow-y-auto h-screen relative"
        onContextMenu={(e) => {
          e.preventDefault();
          setContext(true);
          setContextPos({ x: e.pageX, y: e.pageY });
        }}
      >
        <div className="flex-1 overflow-y-hidden p-4 space-y-4 flex flex-col gap-4">
          {messages.map((msg, index) => {
            const isSender = authUser._id === msg.senderId;
            const messageId = getMessageId(msg, index);
            const isSelected = messageOption === messageId;

            return (
              <div
                key={messageId}
                className={`chat space-y-4 ${isSender ? "chat-end" : "chat-start"} rounded-lg mb-8 relative ${isSelected ? "bg-[#1b34e129]" : ""}`}
                onDoubleClick={() =>
                  setMessageOption((prev) => (prev === messageId ? null : messageId))
                }
              >
                <div className="chat-footer mb-18 flex items-center gap-1">
                  <time className="text-xs opacity-50 ml-1">
                    {isSender
                      ? `Sent ${formatTimeAgo(msg.createdAt)}`
                      : `Received ${formatTimeAgo(msg.createdAt)}`}
                  </time>

                  {starredMessageIds.has(messageId) && (
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ fontSize: "8px" }}
                      className="text-yellow-400 text-sm ml-1 items-baseline align-bottom"
                      title="Starred message"
                    />
                  )}
                </div>

                <div className="chat-bubble bg-base-300 text-white max-w-xs w-fit flex flex-col gap-2 p-14 relative truncate">
                  {msg.text && <Text msg={msgCheck(msg.text)} />}

                  {msg.image && (
                    <div className={`chat-image bg-base-300 ${imgload ? "skeleton" : ""}`}>
                      <img
                        src={msg.image}
                        alt="sent file"
                        className="mb-2 rounded-md sm:max-w-full sm:max-h-full object-cover w-full cursor-pointer"
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
                      className="w-62 bg-base-200 rounded-lg p-2 border-0"
                    >
                      <source src={msg.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}

                  {msg.video && (
                    <div className="flex justify-center items-center w-65">
                      <video
                        controls
                        className="w-65 bg-base-200 rounded-md p-2"
                        controlsList="nodownload"
                      >
                        <source src={msg.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {openImg && msg.image && (
                    <ImagePreview src={imgSrc} close={() => setOpenImg(false)} />
                  )}
                </div>
                {isSelected && (
                  <div className={`absolute ${isNearBottom(index, messageOption) ? "bottom-full mb-2" : "top-full mt-2"} ${!isSender ? "left-12" : "right-12"} absolute bg-base-100 text-white border-0 shadow-md w-32 h-22 max-h-fit rounded z-50 text-sm message-options`}
                    style={{ padding: "4px" }}>
                    <ul className="flex flex-col justify-evenly w-full h-full gap-1">
                      <li
                        className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer"
                        onClick={() => handleStarMessage(messageId)}
                      >
                        {starredMessageIds.has(messageId) ? "Unstar" : "Star"}
                      </li>
                      <li
                        className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-500"
                        onClick={() => handleDeleteMessage(messageId)}
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && isTyping.now && (
            <div className={`${isTyping.sender === authUser._id ? "chat-end" : "chat-start"} flex flex-row justify-start align-bottom p-12`} style={{ padding: "6px" }}>
              <span className="loading loading-dots loading-md"></span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {context && <ContextMenu x={contextPos.x} y={contextPos.y} />}
    </>
  );
}
