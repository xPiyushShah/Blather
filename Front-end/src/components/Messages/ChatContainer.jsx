import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideoCamera,
  faPhone,
  faSmile,
  faPaperPlane,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import Message from "./Message";
export default function ChatContainer({ data }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Store all chat messages
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleInputFocus = () => {
    setShowEmojiPicker(false);
  };

  const sendMsg = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: message,
      time: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      alert("Only image files are allowed!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newMessage = {
        id: Date.now(),
        sender: "me",
        text: (
          <img src={reader.result} alt="sent" className="max-w-xs max-h-40" />
        ),
        time: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Header for Chat Box Start */}
      <div className="header-lest ">
        <div className="lest-1 lest-apply avatar">
          <div className="w-10 rounded-full">
            <img alt={data.name} src={data.src} />
          </div>
        </div>
        <div className="lest-2 lest-apply">{data.name}</div>
        <div className="lest-3 lest-apply">
          <div className="opt rounded-r-lg">
            <FontAwesomeIcon icon={faVideoCamera} />
          </div>
          <div className="opt rounded-l-lg">
            <FontAwesomeIcon icon={faPhone} />
          </div>
        </div>
      </div>
      {/* Header for Chat Box End  */}
      {/* MiddleBox Start */}
      <div className="chat-show content-end scroll-smooth snap-proximity snap-both snap-y overflow-y-auto h-screen">
        <Message messages={messages} />
      </div>
      {/* MiddleBox End */}
      {/* Text Area Start */}
      <div className="text-area ">
        <div className="emoji opt hover:rounded-lg rounded-lg">
          {showEmojiPicker && (
            <div style={{ position: "absolute", bottom: "70px", zIndex: 100 }}>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <FontAwesomeIcon
            icon={faSmile}
            size="lg"
            style={{ cursor: "pointer" }}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
        </div>
        <div className="text-box">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={handleInputFocus}
            className="text-box-input"
          />
        </div>
        <div className="file-box rounded-lg ">
          <div className="icon-wrapper rounded-l-lg">
            <FontAwesomeIcon
              icon={faPlusCircle}
              style={{ cursor: "pointer" }}
              onClick={() => fileInputRef.current.click()}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="icon-wrapper  rounded-r-lg">
            <FontAwesomeIcon
              icon={faPaperPlane}
              onClick={sendMsg}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
      {/* Text Area End */}
    </>
  );
}
