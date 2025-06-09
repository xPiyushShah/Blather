import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faPaperPlane,
  faPlusCircle,
  faXmark,
  faImage
} from "@fortawesome/free-solid-svg-icons";

import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { useChatStore } from "../../store/useChatStore";

export default function InputArea() {
  const [text, settext] = useState("");
  const [imagePreview, setPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const { sendMessage } = useChatStore();

  const handleEmojiClick = (emojiData) => {
    settext((prev) => prev + emojiData.emoji);
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
  };
  const removeImage = () => {
    setPreview(null);
    fileInputRef.current.value = null;
  };
  const sendMsg = async () => {
    if (!text.trim() && !imagePreview) return;
    // settexts((prev) => [...prev, newtext]);

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    settext("");
    setShowEmojiPicker(false);
    setPreview(null);
  };

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
              <FontAwesomeIcon
                icon={faXmark}
              />
            </button>
          </div>
        )}
        <div>
          <input
            type="text"
            placeholder="Type a text..."
            value={text}
            onChange={(e) => settext(e.target.value)}
            onFocus={handleInputFocus}
            className="text-box-input w-full input-borderd round-lg input-sm sm:input-md"
          />
        </div>
      </div>

      <div className="file-box rounded-lg ">
        <div className="icon-wrapper rounded-l-lg">
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
        <div className="icon-wrapper  rounded-r-lg">
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
