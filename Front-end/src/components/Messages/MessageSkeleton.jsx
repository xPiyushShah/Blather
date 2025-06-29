import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { useChatStore } from "../../store/useChatStore";
import ContextMenu from "../../utils/contextMenu.jsx";

function MessageSkeleton() {
    const { selectedUser } = useChatStore();
    const [context, setContext] = useState(false);
    const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
    return (
        <>
            <div className="flex flex-col justify-center items-center h-[75%] text-gray-400 gap-4 relative"
                onContextMenu={(e) => {
                    e.preventDefault();
                    setContext(true);
                    setContextPos({ x: e.pageX, y: e.pageY });
                }}>
                <FontAwesomeIcon
                    icon={faEnvelope}
                    size="4x"
                    className="animate-pulse"
                />
                <p className="capitalize-each-word text-x font-semibold transform">No messages with {selectedUser.first_name}   <span className="loading loading-dots loading-sm font-extralight"></span></p>
            </div>
            {context && <ContextMenu x={contextPos.x} y={contextPos.y} />}
        </>
    )
}

export default MessageSkeleton