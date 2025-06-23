import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";

function MessageSkeleton() {
    return (
        <div className="flex flex-col justify-center items-center h-[75%] text-gray-400 gap-4">
            <FontAwesomeIcon
                icon={faEnvelope}
                size="4x"
                className="animate-pulse"
            />
            <p className="text-x font-semibold">No messages yet...</p>
        </div>
    )
}

export default MessageSkeleton