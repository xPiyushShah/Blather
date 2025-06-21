import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useChatStore } from '../../../store/useChatStore.js';


function Mic({ close }) {
    const { sendMedia } = useChatStore();
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [volume, setVolume] = useState(0);
    const animationRef = useRef(null);
    const bars = Array.from({ length: 60 }); // more bars for horizontal

    useEffect(() => {
        const start = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) setChunks(prev => [...prev, e.data]);
            };
            recorder.start();
            setMediaRecorder(recorder);

            // Analyze audio volume
            const audioCtx = new AudioContext();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            source.connect(analyser);

            const animate = () => {
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
                setVolume(avg);
                animationRef.current = requestAnimationFrame(animate);
            };

            animate();
        };

        start();

        return () => {
            if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const stopRecording = () => {
        if (mediaRecorder?.state === 'recording') {
            mediaRecorder.stop();
        }

        if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            sendAudio(blob);
            setChunks([]);
        }

        cancelAnimationFrame(animationRef.current);
        // close();
    };

    const sendAudio = async (blob) => {
        //  stopRecording
        // console.log("Sending audio...", blob);
        if (!blob) {
            console.error("No audio data to send");
        }

        // Convert blob to File if needed
        const file = new File([blob], "audio.webm", { type: "audio/webm" });

        // console.log("Sending file:", file);
        // Send the audio file using sendMedia function

        if (!file) {
            console.error("No audio file to send");
            return;
        }
        // Call the sendMedia function with the audio file
   

        await sendMedia({
            video: "",
            audio: file,
        });
        close();
    };
    const handleSend = (data) => {
        if (data == 1) {
            stopRecording();
        } else if (data == 2) {
            close();
            mediaRecorder.stop();
        }
    };


    return (
        <div className="text-area relative flex flex-row align-center justify-between border-t-[1px] gap-8 border-t-[#dddddd35] max-h-fit min-h-[calc(100% - 75%)] w-full ">
            <div className="flex flex-row items-center justify-between gap-6 w-full h-full rounded-lg">
                <div className="flex flex-row items-center justify-center start-2 w-full align-center gap-[2px]">
                    {bars.map((_, i) => {
                        const sine = Math.sin(i * 0.3 + volume / 10);
                        const height = Math.max(10, Math.abs(sine) * volume * 0.6);
                        return (
                            <div
                                key={i}
                                className="w-full bg-white rounded-sm transition-all duration-75"
                                style={{
                                    height: `${height + 4}px`,
                                }}
                            />
                        );
                    })}
                </div>
                <div className="file-box rounded-lg ">
                    <div className="icon-wrapper rounded-l-lg">
                        <button
                            className=" text-white text-lg align-center justify-center w-6 h-8  flex items-center"
                            onClick={() => handleSend(2)}>
                            ×
                        </button>
                    </div>
                    <div className="icon-wrapper  rounded-r-lg  flex items-center justify-center ">
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            style={{ cursor: "pointer", marginTop: "8px" }}
                            onClick={() => handleSend(1)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mic;
