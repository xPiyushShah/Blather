import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

function ImagePreview({ src, close }) {
  const downloadImage = async () => {
    try {
      const response = await fetch(src, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Image download failed:", err);
    }
  };

  const imgRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <button
          onClick={close}
          className="absolute top-3 right-3 text-white hover:bg-red-600 rounded-full p-1 w-8 h-8 flex items-center justify-center"
          title="Close"
        >
          ✕
        </button>
      <div className="relative bg-white rounded-lg p-4 shadow-lg max-w-3xl w-[90vw]">

        {src && (
          <div className="relative">
            <img
              ref={imgRef}
              src={src}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
            <button
              onClick={downloadImage}
              className="absolute bottom-3 right-3 bg-white text-green-600 p-2 rounded-full shadow-md hover:bg-gray-200"
              title="Download Image"
            >
              <FontAwesomeIcon icon={faFileArrowDown} size="lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImagePreview;
