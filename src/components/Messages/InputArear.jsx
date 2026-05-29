import React, { useState, useEffect, useRef, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faPaperPlane,
    faPlusSquare,
    faImage,
    faMicrophone,
    faFile,
    faChalkboard,
    faCamera,
} from "@fortawesome/free-solid-svg-icons";

import { useChatStore } from "../../store/useChatStore";

const Mic = React.lazy(() => import("./Aparts/Mic.jsx"));
const Camera = React.lazy(() => import("./Aparts/Camera.jsx"));
const Board = React.lazy(() => import("./Aparts/Board.jsx"));
const Loading = React.lazy(() => import("../Loaders/MessageLoading.jsx"));

function InputArear() {
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState(null);
    const [previewType, setPreviewType] = useState(null);
    const [previewLoaded, setPreviewLoaded] = useState(true);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [allBox, setShowAllBox] = useState(false);
    const [activeTool, setActiveTool] = useState(null);

    const { sendMessage, sendMedia } = useChatStore();

    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const modalRef = useRef(null);
    const toolRef = useRef(null);

    // SEND MESSAGE
    const Sender = async () => {
        if (!message.trim() && !preview) return;
        
        console.log("Sending Message:", { text: message, file: preview, type: previewType });
        
        if (preview && previewType) {
            await sendMedia({ text: message, file: preview, type: previewType, });
        }
        

        if (!preview) {
            await sendMessage({ text: message });
        }


        setMessage("");
        setShowEmojiPicker(false);

        setPreview(null);
        setPreviewType(null);
        setActiveTool(null);

        if (imageInputRef.current) imageInputRef.current.value = "";
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // REMOVE PREVIEW
    const removePreview = () => {
        setPreview(null);
        setPreviewType(null);
        setActiveTool(null);
        setPreviewLoaded(true);

        if (imageInputRef.current) imageInputRef.current.value = "";
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // IMAGE + VIDEO
    const handleImageVideoChange = (e) => {
        const file = e.target.files?.[0];

        // console.log("Selected File:", file);

        if (!file) {
            // console.log("No file selected");
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "video/mp4",
            "video/webm",
            "video/ogg",
        ];

        if (!allowedTypes.includes(file.type)) {
            // alert("Only JPEG images and videos allowed");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setPreview(reader.result);

            if (file.type.startsWith("image/")) {
                setPreviewType("image");
            } else if (file.type.startsWith("video/")) {
                setPreviewType("video");
            }

            setActiveTool("preview");

            // console.log("Preview Ready");
        };

        reader.readAsDataURL(file);
        setPreviewLoaded(false);
    };

    // PDF
    const handlePdfChange = (e) => {
        const file = e.target.files?.[0];

        // console.log("Selected PDF:", file);

        if (!file) return;

        if (file.type !== "application/pdf") {
            // alert("Only PDF allowed");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setPreview(reader.result);
            setPreviewType("pdf");
            setActiveTool("preview");
        };

        reader.readAsDataURL(file);
        setPreviewLoaded(false);
    };

    // CLICK OUTSIDE
    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedOutsideAllBox =
                modalRef.current &&
                !modalRef.current.contains(event.target);

            const clickedOutsideTool =
                toolRef.current &&
                !toolRef.current.contains(event.target);

            if (clickedOutsideAllBox && clickedOutsideTool) {
                setShowAllBox(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div className="flex flex-row justify-between items-center w-full h-full p-4 se relative " style={{ padding: "12px" }} >
            {/* PREVIEW / TOOLS */}
            {activeTool && (
                <div className="absolute bg-base-100/70 backdrop-blur-md shadow-xl border-white/20 w-full h-98 right-2 bottom-18 rounded-lg z-50 gap-2 flex items-center justify-center" style={{ padding: "2px 6px" }} ref={toolRef}>
                    <div className="w-full h-full flex items-center justify-center" style={{ padding: "2px 8px" }}>

                        {previewLoaded && (
                            <div className="absolute w-full h-full flex items-center justify-center z-50">
                                <Loading />
                            </div>)}

                        <Suspense fallback={<Loading />}>

                            {/* PREVIEW */}
                            {activeTool === "preview" && (
                                <div className="relative w-full h-full flex items-center justify-center ">

                                    {/* IMAGE */}
                                    {previewType === "image" && (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    )}

                                    {/* VIDEO */}
                                    {previewType === "video" && (
                                        <video
                                            src={preview}
                                            controls
                                            autoPlay
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    )}

                                    {/* PDF */}
                                    {previewType === "pdf" && (
                                        <iframe
                                            src={preview}
                                            title="PDF Preview"
                                            className="w-full h-full rounded-lg bg-white"
                                        />
                                    )}

                                    {/* CLOSE */}

                                </div>
                            )}

                            {/* MIC */}
                            {activeTool === "mic" && (
                                <Mic close={() => setActiveTool(null)} />
                            )}

                            {/* CAMERA */}
                            {activeTool === "camera" && (
                                <Camera close={() => setActiveTool(null)} />
                            )}

                            {/* BOARD */}
                            {activeTool === "board" && (
                                <Board close={() => setActiveTool(null)} />
                            )}

                        </Suspense>
                    </div>
                    <div onClick={removePreview} className="absolute top-1 right-0 bg-black w-6 h-6  text-white rounded-full flex items-center justify-center z-50">
                        <button  >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* ALL BOX */}
            {allBox && (
                <div
                    className="absolute bg-base-100/70 backdrop-blur-md shadow-xl border-white/20 bottom-18 right-4 rounded-lg z-40 w-35 h-30 flex align-center justify-center"
                    style={{ padding: "4px 12px" }}
                    ref={modalRef}
                >
                    <div className="p-6 text-white grid grid-cols-3 gap-6 place-items-center">

                        {/* MIC */}
                        <div
                            onClick={() => {
                                setActiveTool("mic");
                                setShowAllBox(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faMicrophone} />
                        </div>

                        {/* CAMERA */}
                        <div
                            onClick={() => {
                                setActiveTool("camera");
                                setShowAllBox(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faCamera} />
                        </div>

                        {/* PDF */}
                        <div
                            onClick={() => {
                                fileInputRef.current?.click();

                                setTimeout(() => {
                                    setShowAllBox(false);
                                }, 100);
                            }}
                        >
                            <FontAwesomeIcon icon={faFile} />
                        </div>

                        {/* BOARD */}
                        <div
                            onClick={() => {
                                setActiveTool("board");
                                setShowAllBox(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faChalkboard} />
                        </div>

                        {/* IMAGE + VIDEO */}
                        <div
                            onClick={() => {
                                imageInputRef.current?.click();

                                setTimeout(() => {
                                    setShowAllBox(false);
                                }, 100);
                            }}
                        >
                            <FontAwesomeIcon icon={faImage} />
                        </div>

                    </div>
                </div>
            )}

            {/* HIDDEN INPUTS */}
            <input
                type="file"
                ref={imageInputRef}
                style={{ display: "none" }}
                accept="image/jpeg,image/jpg,video/mp4,video/webm,video/ogg"
                onChange={handleImageVideoChange}
            />

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="application/pdf"
                onChange={handlePdfChange}
            />

            {/* INPUT */}
            <div className="input-box bg-transparent h-full w-full p-2">
                <input
                    type="text"
                    className="w-full h-full bg-transparent outline-none"
                    placeholder="Type a message..."
                    value={message}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") Sender();
                    }}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-row gap-4 ml-4 text-[#dddddd] *:cursor-pointer bg-[rgba(0,0,0,0.1)] p-2 rounded-lg">

                <div>
                    <FontAwesomeIcon
                        icon={faPlusSquare}
                        size="lg"
                        onClick={() =>
                            setShowAllBox((prev) => !prev)
                        }
                    />
                </div>

                <div onClick={Sender}>
                    <FontAwesomeIcon
                        icon={faPaperPlane}
                        size="lg"
                    />
                </div>

            </div>
        </div>
    );
}

export default InputArear;