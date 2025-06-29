import React, { useState, useEffect } from "react";

// store
import { functionStore } from "../store/functionStore.js";

// helper functions
import { msgCheck, userExtract } from "../helper/messages.js";

// components
import Text from "../utils/Text.jsx";
import ImagePreview from "./Messages/extra/ImagePreview.jsx";

function Star() {
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  const {
    starredMessages,
    removeStarMessage,
    loadStarMessages
  } = functionStore();

  useEffect(() => {
    loadStarMessages();
  }, []);

  return (
    <>
      <div className="flex flex-col bg-transparent hover:cursor-resize color-green-400 w-full h-full uppercase">
        <div className="border-b-[1px] border-b-[#dddddd35] h-[5rem] w-full items-center font-bold py-12 bg-base-100"
          style={{ padding: "11px 21px" }}>
          Star Messages
        </div>

        <div className="w-full h-full text-center overflow-y-auto">
          {Array.isArray(starredMessages) && starredMessages.length > 0 ? (
            starredMessages.map((data, index) => (
              <div key={index}
                className="h-fit border-b-[1px] border-b-[#dddddd35] text-wrap hover:cursor-pointer text-white w-full flex flex-row gap-2 p-4"
                style={{ padding: "12px 22px" }}>
                
                <p className="text-left text-[12px] opacity-30">{index + 1}</p>

                <div className="chat-bubble bg-base-300 text-white max-w-xs w-fit flex flex-col gap-2 p-14 relative truncate">
                  {data.text && <Text msg={msgCheck(data.text)} />}
                  {data.image && (
                    <div className="chat-image bg-base-300">
                      <img
                        src={data.image}
                        alt="sent file"
                        className="mb-2 rounded-md object-cover w-full cursor-pointer"
                        loading="lazy"
                        onClick={() => {
                          setOpenImg(true);
                          setImgSrc(data.image);
                        }}
                      />
                    </div>
                  )}

                  {data.audio && (
                    <audio controls controlsList="nodownload" className="w-62 bg-base-200 rounded-lg p-2 border-0">
                      <source src={data.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}

                  {data.video && (
                    <div className="flex justify-center items-center">
                      <video
                        controls
                        className="w-65 bg-base-200 rounded-md p-2"
                        controlsList="nodownload"
                      >
                        <source src={data.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>

                {openImg && data.image && (
                  <ImagePreview src={imgSrc} close={() => setOpenImg(false)} />
                )}

                <div className="flex flex-col justify-between relative">
                  <button
                    onClick={() => removeStarMessage(data)}
                    className="text-white hover:bg-white/10 rounded-full px-2 py-1"
                    title="Remove from starred"
                  >
                    ✕
                  </button>
                  <p className="text-right text-[12px] opacity-30 mr-28">
                    {userExtract(data)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-8">No starred messages.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Star;
