import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faPaperPlane, faPen } from "@fortawesome/free-solid-svg-icons";
import { useChatStore } from '../../../store/useChatStore.js';

const Board = ({ close, onSend }) => {
    const { sendMessage } = useChatStore();
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);

    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(3);
    const [isErasing, setIsErasing] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 800;
        canvas.height = 600;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        setCtx(context);
    }, []);

    useEffect(() => {
        if (ctx) {
            ctx.strokeStyle = isErasing ? '#ffffff' : color;
            ctx.lineWidth = lineWidth;
        }
    }, [color, lineWidth, isErasing, ctx]);

    const startDrawing = (e) => {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        setMousePos({ x: offsetX, y: offsetY });

        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        ctx.closePath();
    };

    const handleSend = async () => {
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL('image/png');

        await sendMessage({
            text: "",
            image: imageData,
        });
        close();
    };

    const [toolboxPos, setToolboxPos] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const toolboxRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.target.closest('.drag-handle')) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - toolboxPos.x,
                y: e.clientY - toolboxPos.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setToolboxPos({
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleSelectPen = () => {
        setIsErasing(false);
        setColor(prev => prev || '#000000');
    };

    const handleSelectEraser = () => {
        setIsErasing(true);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey) {
                if ((e.key === '+' || e.key === '=')) {
                    e.preventDefault();
                    if (isErasing) {
                        setLineWidth((prev) => Math.min(prev + 1, 50));
                    }
                } else if (e.key === '-') {
                    e.preventDefault();
                    if (isErasing) {
                        setLineWidth((prev) => Math.max(prev - 1, 1));
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isErasing]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <button
                onClick={close}
                className="absolute top-3 right-3 text-white hover:bg-red-600 rounded-full p-1 w-8 h-8 flex items-center justify-center"
                title="Close"
            >
                ✕
            </button>
            <div className="flex flex-row items-center justify-evenly space-y-4 p-4 bg-base-100 rounded shadow-lg h-screen w-[95%]">
                <div className="border border-gray-400 shadow-lg w-[95%] h-[95%] relative">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="bg-white w-full h-full"
                    />
                    {isErasing && (
                        <div
                            style={{
                                position: 'absolute',
                                left: mousePos.x - lineWidth / 2,
                                top: mousePos.y - lineWidth / 2,
                                width: lineWidth,
                                height: lineWidth,
                                backgroundColor: 'white',
                                border: '1px solid gray',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </div>
                <div
                    ref={toolboxRef}
                    onMouseDown={handleMouseDown}
                    style={{
                        position: 'absolute',
                        left: toolboxPos.x,
                        top: toolboxPos.y,
                        zIndex: 1000,
                    }}
                    className="border border-gray-400 flex flex-col items-center justify-evenly w-16 h-fit bg-white shadow-xl rounded-lg p-3 gap-6 overflow-hidden"
                >
                    <div className="text-black w-full text-center drag-handle cursor-move text-sm font-semibold border-b pb-1 mb-2">
                        H
                    </div>

                    <button
                        onClick={handleSelectPen}
                        className={`w-10 h-10 flex items-center justify-center rounded ${!isErasing ? 'border-2 border-blue-600' : ''}`}
                        title="Pen"
                    >
                        <FontAwesomeIcon icon={faPen} className="text-xl" style={{ color }} />
                    </button>

                    {!isErasing && (
                        <div className="flex flex-col items-center space-y-2 gap-6">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-8 h-8 border-none"
                                title="Choose Color"
                            />
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={lineWidth}
                                onChange={(e) => setLineWidth(Number(e.target.value))}
                                className="w-full rotate-270"
                                title="Line Width"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleSelectEraser}
                        className={`w-10 h-10 flex items-center justify-center rounded ${isErasing ? 'border-2 border-blue-600' : ''}`}
                        title="Eraser"
                    >
                        <FontAwesomeIcon icon={faEraser} className="text-xl text-gray-700" />
                    </button>

                    <button
                        onClick={handleSend}
                        className="mt-2 text-black bg-white/10 p-2 rounded-lg hover:bg-white/65 hover:border-2 hover:cursor-pointer hover:text-black transition-colors duration-200 flex items-center justify-center w-10 h-10"
                        title="Send Drawing"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Board;
