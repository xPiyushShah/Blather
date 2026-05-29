import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faImage,
    faVideo,
    faStop,
    faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

//store 
import { useChatStore } from "../../../store/useChatStore.js"

function Camera({ close }) {
    const { sendMessage, sendMedia } = useChatStore();
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [videoChunks, setVideoChunks] = useState([]);
    const [recordedVideo, setRecordedVideo] = useState(null);
    const [recording, setRecording] = useState(false);

    // Take snapshot
    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setRecordedVideo(null);
    };

    // Start/Stop video recording
    const toggleRecording = async () => {
        if (!recording) {
            setCapturedImage(null);
            setVideoChunks([]);
            setRecordedVideo(null);

            const stream = webcamRef.current.stream;
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm',
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setVideoChunks((prev) => [...prev, event.data]);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(videoChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedVideo(url);
            };

            mediaRecorder.start();
            setRecording(true);
        } else {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handleSend = async () => {
        try {
            if (capturedImage) {
                await sendMessage({
                    text: "",
                    image: capturedImage,
                });
            } else if (recordedVideo) {
                const blob = await fetch(recordedVideo).then(res => res.blob());
                await sendMedia({
                    audio: "",
                    video: blob,
                });
            }

            close();
        } catch (error) {
            console.error("Error sending media:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 w-full h-full">
            <button
                className="absolute top-2 right-2 btn btn-sm btn-circle"
                onClick={() => close(false)}
            >
                ✕
            </button>

            <div className="flex flex-row items-center justify-between p-6 gap-4 rounded-sm  shadow-lg max-w-3xl w-[80vw] h-[45vw] ">
                <div >
                    LIVE-
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className={`shadow rounded-sm ${(capturedImage || recordedVideo) ? "w-45 h-45  " : "w-full h-full "}`}
                    />
                </div>
                <div className="flex  mt-4   flex-col gap-6 rounded-sm z-10 bg-white/30" style={{ padding: "4px" }} >
                    <button type="button" onClick={handleCapture} className="btn">
                        <FontAwesomeIcon icon={faCamera} />
                    </button>

                    <button type="button" onClick={toggleRecording} className="btn">
                        <FontAwesomeIcon
                            icon={recording ? faStop : faVideo}
                            className={recording ? 'text-red-600' : ''}
                        />
                    </button>


                    {(capturedImage || recordedVideo) && (
                        <button onClick={handleSend} className="btn btn-success">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    )}
                </div>
                <div className=''>
                    Gallery:
                    {capturedImage && (
                        <div className="mt-4">
                            <img src={capturedImage} alt="Captured" className="rounded w-84 h-auto" />
                        </div>
                    )}

                    {recordedVideo && (
                        <div className="mt-4">
                            <video src={recordedVideo} controls className="rounded w-84 h-auto" />
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}

export default Camera;
