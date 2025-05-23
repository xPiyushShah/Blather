import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEnvelope, faMessage } from "@fortawesome/free-solid-svg-icons";

const avatars = {
  me: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
  friend: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
};

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
  if (hours < 48) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function Message({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Force re-render every 1s to update "ago" text
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-blue-400 gap-8 ">
        <FontAwesomeIcon icon={faEnvelope} size="8x"  className="flex animate-pulse space-x-4"/>
        <p className="mt-4 text-sm">No messages yet...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat ${
            msg.sender === "me" ? "chat-end" : "chat-start"
          } mb-4`}>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img alt={msg.sender} src={avatars[msg.sender]} />
            </div>
          </div>
          <div className="chat-bubble bg-blue-500 text-white flex gap-6 ">
            {typeof msg.text === "string" ? msg.text : msg.text}
          <p className="chat-footer text-x text-gray-600 mt-1 self-end">
            {msg.sender === "me"
              ? `Sent ${formatTimeAgo(msg.time)}`
              : "Delivered"}
          </p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
