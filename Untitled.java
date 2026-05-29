import React from 'react'
// import { useChatStore } from "../../store/useChatStore.js";

function MessageLoading() {
    // const {  isMessageLoading } = useChatStore();
    return (
        <>
            <div className="flex flex-row items-end justify-center h-full mb-12">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        </>
    )
}

export default MessageLoading