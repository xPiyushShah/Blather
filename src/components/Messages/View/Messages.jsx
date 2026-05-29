import React, { useEffect, useRef, useState, Suspense } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useFunction } from "../../../store/useFunction";
import { useChatStore } from "../../../store/useChatStore.js";

const ImagePreview = React.lazy(() => import("../Aparts/ImagePreview.jsx"));
const ContextMenu = React.lazy(() => import("../Aparts/ContextMenu.jsx"));
const BlankMessages = React.lazy(() => import("../BlankMessages.jsx"));
const MessageLoading = React.lazy(() => import("../../Loaders/MessageLoading.jsx"));

// helper function 
import { msgCheck } from "../../../utils/Helper/FirstHelper.js";

export default function Message() {
    const { authUser, socket } = useAuthStore();
    const { selectMsg, setSelectMsg } = useFunction();// for checkbox
    const { messages, selectedUser, getMessages, updateMessage, isMessageLoading } = useChatStore();// for checkbox
    const containerRef = useRef(null);
    const bottomRef = useRef(null);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [context, setContext] = useState(null);
    const [openImg, setOpenImg] = useState(false);
    const [imgSrc, setImgSrc] = useState("");
    const [isDoubleClicked, setIsDoubleClicked] = useState(false);
    const [starredMessageIds, setStarredMessageIds] = useState(new Set());

    const isNearBottom = (index, messages) => {
        const threshold = 2;
        return messages.length - index <= threshold;
    };

    useEffect(() => {
        if (!selectedUser?._id) return;
        getMessages(selectedUser._id);
    }, [selectedUser?._id]);

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

    useEffect(() => {
        const handleClick = () => {
            setContext(null);
            setIsDoubleClicked(false);
            setSelectedMessage(null);
        };

        window.addEventListener("click", handleClick);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

        return () => window.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleRightClick = (e, index) => {
        if (isDoubleClicked) return;

        e.preventDefault();

        const rect = containerRef.current.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        const menuWidth = 160;
        const menuHeight = 120;

        if (x + menuWidth > rect.width) {
            x = rect.width - menuWidth;
        }

        if (y + menuHeight > rect.height) {
            y = rect.height - menuHeight;
        }

        const openUpwards = isNearBottom(index, messages);

        setContext({ x, y, openUpwards });
    };

    const handleStarMessage = (id) => {
        setStarredMessageIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleDeleteMessage = (id) => {
        console.log("Delete", id);
    };

    const getMessageId = (msg, index) => index;

    return (
        <div className="w-full h-full flex flex-col bg-transparent px-4 py-3">

            {messages.length == 0 && !isMessageLoading && (<div className="w-full flex-1 h-full" onContextMenu={(e) => handleRightClick(e, index)}><BlankMessages /></div>)}

            {isMessageLoading && (
                <MessageLoading />
            )}

            {!isMessageLoading && messages.length > 0 && (

                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 relative custom-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth"
                    style={{ padding: "10px 12px" }}
                >
                    {messages.map((msg, index) => {
                        const isSender = msg.senderId === authUser._id;
                        const messageId = getMessageId(msg, index);
                        const isSelected = selectedMessage === messageId;

                        return (
                            <div
                                key={messageId}
                                className={`flex w-full gap-4 ${isSender ? "justify-end" : "justify-start"
                                    }`}
                                onContextMenu={(e) => handleRightClick(e, index)}
                            >
                                {selectMsg && (
                                    <div>
                                        <input
                                            type="checkbox"
                                            className="mt-2 flex justify-start align-center"
                                            checked={isSelected}
                                            onChange={() => {
                                                setSelectedMessage((prev) =>
                                                    prev === messageId
                                                        ? null
                                                        : messageId
                                                );
                                            }}
                                        />
                                    </div>
                                )}
                                <div
                                    className={`relative px-4 py-2 rounded-2xl text-sm md:text-base break-words max-w-[70%] shadow-md transition-all duration-200 ${isSender
                                        ? "bg-blue-500 text-white rounded-br-none"
                                        : "bg-green-500 text-white rounded-bl-none"
                                        } ${isSelected
                                            ? "ring-2 ring-black/20 scale-[1.02]"
                                            : ""
                                        }`}
                                    style={{ padding: "6px 12px" }}
                                >
                                    <span
                                        onDoubleClick={() => {
                                            setSelectedMessage((prev) =>
                                                prev === messageId
                                                    ? null
                                                    : messageId
                                            );
                                            setIsDoubleClicked(true);
                                            setContext(null);
                                        }}
                                    >
                                        {msgCheck(msg.text)}
                                        {msg.image && (
                                            <div className={`chat-image bg-base-300 `}>
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
                                    </span>

                                    {isSelected && isDoubleClicked && (
                                        <div
                                            className={`absolute ${isNearBottom(index, messages)
                                                ? "bottom-full mb-2"
                                                : "top-full mt-2"
                                                } ${!isSender ? "left-12" : "right-12"
                                                } bg-base-100 text-white border-0 shadow-md w-32 rounded z-50 text-sm message-options`}
                                            style={{ padding: "4px" }}
                                        >
                                            <ul className="flex flex-col gap-1">
                                                <li
                                                    className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer"
                                                    onClick={() =>
                                                        handleStarMessage(messageId)
                                                    }
                                                >
                                                    {starredMessageIds.has(messageId)
                                                        ? "Unstar"
                                                        : "Star"}
                                                </li>
                                                <li
                                                    className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-500"
                                                    onClick={() =>
                                                        handleDeleteMessage(messageId)
                                                    }
                                                >
                                                    Delete
                                                </li>
                                            </ul>
                                        </div>
                                    )}

                                    <span
                                        className={`absolute bottom-0 ${isSender
                                            ? "right-[-6px]"
                                            : "left-[-6px]"
                                            } w-0 h-0 border-t-[6px] border-b-[6px] ${isSender
                                                ? "border-l-[6px] border-l-blue-500 border-t-transparent border-b-transparent"
                                                : "border-r-[6px] border-r-green-500 border-t-transparent border-b-transparent"
                                            }`}
                                    ></span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            )}
            {context && (
                <Suspense fallback={null}>
                    <ContextMenu
                        data={context}
                        onClose={() => setContext(null)}
                    />
                </Suspense>
            )}
        </div>
    );
}