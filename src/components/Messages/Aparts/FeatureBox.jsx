import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faPaperPlane,
    faPlusSquare,
    faXmark,
    faImage,
    faMicrophone,
    faFile,
    faChalkboard,
    faCamera
} from "@fortawesome/free-solid-svg-icons";

const FeatureBox = ({  muteFunction  }) => {
    const { modalRef , fileInputRef , handleFileChange , setActiveTool , setShowAllBox} = muteFunction;

  return (
              <div className="absolute bg-base-100/70 backdrop-blur-md shadow-xl border-white/20 bottom-16 right-4  rounded-lg z-40 w-35 h-30 flex align-center justify-center" style={{ padding: "4px 12px" }} ref={modalRef}>
                    <div className="p-6 text-white grid grid-cols-3 gap-6 place-items-center" >
                        <div onClick={() => { setActiveTool("mic"); setShowAllBox(false); }}>
                            <FontAwesomeIcon icon={faMicrophone} />
                        </div>
                        <div onClick={() => { setActiveTool("camera"); setShowAllBox(false); }}>
                            <FontAwesomeIcon icon={faCamera} />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faFile} />
                        </div>
                        <div onClick={() => { setActiveTool("board"); setShowAllBox(false); }}>
                            <FontAwesomeIcon icon={faChalkboard} />
                        </div>

                        <div onClick={() => { setShowAllBox(false); }}>
                            <FontAwesomeIcon
                                icon={faImage}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
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
  )
}

export default FeatureBox
