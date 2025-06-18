import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare,faCamera } from "@fortawesome/free-solid-svg-icons";
import Webcam from "react-webcam";

function ImageModal({ setChng }) {
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured.png", { type: "image/png" });
        setFormData({ ...formData, profile: file });
        setPreview(imageSrc);
        setShowCamera(false);
      });
  };
  return (
    <>
      <div className="modal modal-open w-full h-full">
        <div className="modal-box flex flex-col items-center">
          <h3 className="font-bold text-lg flex flex-row">
            Change Profile Picture...
          </h3>
          <div className="flex flex-row justify-center ">
            <button
              type="button"
              onClick={() => setShowCamera(!showCamera)}
              className="btn">
              <FontAwesomeIcon icon={faCamera} />
            </button>
          </div>
          {showCamera && (
            <div className="my-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded shadow"
              />
              <button
                type="button btn"
                onClick={handleCapture}
                className="btn mt-2">
                Capture
              </button>
            </div>
          )}

          <div className="footer modal-footer flex justify-end flex-row gap-2">
            <button className="btn">Change</button>
            <button className="btn" onClick={() => setChng(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageModal;
