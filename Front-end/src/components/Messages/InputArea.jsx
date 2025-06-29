import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faPaperPlane,
  faPlusCircle,
  faXmark,
  faImage,
  faSquareCaretDown,
  faMicrophone, faVideo, faFile, faChalkboard,
  faCamera
} from "@fortawesome/free-solid-svg-icons";

import EmojiPicker from "emoji-picker-react";
import { Picker } from "emoji-mart";
import CryptoJS from "crypto-js";
// import "emoji-mart/css/emoji-mart.css";
import toast from "react-hot-toast";
import { authStore } from "../../store/authStore";
import { useChatStore } from "../../store/useChatStore";
import Mic from "./extra/Mic";
import Board from "./extra/Board";
import Camera from "./extra/Camera";

export default function InputArea() {
  // Extra features
  const [mic, setMic] = useState(false);
  const [board, setBoard] = useState(false);
  const [camera, setCamera] = useState(false);

  // OWN features
  const [text, settext] = useState("");
  const [imagePreview, setPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [allBox, setShowAllBox] = useState(false);

  const fileInputRef = useRef(null);

  const { sendMessage, key, selectedUser } = useChatStore();
  const { socket, authUser } = authStore();

  const handleEmojiClick = (emojiData) => {
    settext((prev) => prev + emojiData.emoji + " ");
  };

  const handleInputFocus = () => {
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image file.");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    sendMsg();
  };
  const removeImage = () => {
    setPreview(null);
    fileInputRef.current.value = null;
  };
  const sendMsg = async () => {
    if (!text.trim() && !imagePreview) return;
    // settexts((prev) => [...prev, newtext]);

    let eText = null;
    if (text) {
      eText = CryptoJS.AES.encrypt(
        text.trim(),
        key
      ).toString();
    }

    await sendMessage({
      text: eText,
      image: imagePreview,
    });
    settext("");
    setShowEmojiPicker(false);
    setPreview(null);
  };
  //typing effect
  const handleTyping = (data) => {
    let now = true;
    if (!data) now = false;
    socket.emit("typing", { sender: authUser._id, recevier: selectedUser._id, text: text, now: data });
  };
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    settext(e.target.value);
    handleTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
    }, 1000);
  };
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close(); // Call the close function
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);



  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (!e.target.closest(".allbox")) {
  //       setShowAllBox(null);
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);
  const handleBoxClicker = () => {
    console.log(allBox)
    setShowAllBox((prev) => !prev)
  }
  if (mic) {
    return (<Mic close={() => setMic(false)} />);
  }
  // if (board) {
  //   return (<Board close={() => setBoard(false)} />);
  // }

  return (
    <div className="text-area relative flex flex-row align-center justify-around border-t-[1px] gap-8 border-t-[#dddddd35] max-h-fit min-h-[calc(100% - 75%)] p-8 w-full ">
      {/* <div className="emoji opt hover:rounded-lg rounded-lg">
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
      </div> */}
      <div className="flex flex-row align-center items-center text-lg cursor-pointer relative allBox">
        <FontAwesomeIcon
          icon={faSquareCaretDown}
          size="lg"
          onClick={handleBoxClicker}
          className={`hover:scale-3d transition-all duration-300 ease-in-out ${allBox ? "rotate-180" : "rotate-270"}`}
        />
      </div>
      {
        board && (
          <Board close={() => setBoard(false)} />
        )
      }
      {
        camera && (
          <Camera close={() => setCamera(false)} />
        )
      }
      {allBox && (
        <div className="absolute bottom-16 left-4 bg-base-100 shadow-lg rounded-lg mt-2 z-40 w-35 h-30 min-w-fit min-h-fit flex align-center justify-center allbox" ref={modalRef}>
          <div className="p-6 text-white grid grid-cols-3 gap-6 place-items-center m-12 *:hover:cursor-pointer  *:hover:scale-110 transition-all duration-300 ease-in-out" onClick={() => setShowAllBox(false)}>
            <div className="flex flex-col items-center gap-2" onClick={() => setMic((prev) => !prev)}>
              <FontAwesomeIcon icon={faMicrophone}  />
            </div>
            <div className="flex flex-col items-center gap-2">
              <FontAwesomeIcon icon={faCamera}   onClick={() => setCamera((prev) => !prev)} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <FontAwesomeIcon icon={faFile}  />
            </div>
            <div className="flex flex-col items-center gap-2">
              <FontAwesomeIcon icon={faChalkboard}  onClick={() => setBoard((prev) => !prev)} />
            </div>
            <div className="flex flex-col items-center gap-2 ">
              <FontAwesomeIcon
                icon={faImage}
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
          </div>
        </div>
      )}
      <div className="flex bg-base-200 w-full relative rounded-lg">
        {imagePreview && (
          <div className="mb-13 flex text-center gap-2 absolute -top-24">
            <img
              src={imagePreview}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              type="button"
              onClick={removeImage}
              className="abolute -top-1.5 w-5 h-5 cursor-pointer rounded-full bg-base-300 flex justify-center item-center text-center">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}
        <div className="w-full h-full">
          <input
            type="text"
            placeholder="Type a text..."
            value={text}
            onChange={handleChange}
            onFocus={handleInputFocus}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMsg();
              }
            }}
            className="text-box-input w-full input-borderd round-lg input-sm sm:input-md"
          />
        </div>
      </div>

      <div className="file-box rounded-lg ">
        <div className="icon-wrapper  rounded-lg">
          <FontAwesomeIcon
            icon={faPaperPlane}
            onClick={sendMsg}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
