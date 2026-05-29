import React, { useEffect, useRef, useState, Suspense } from "react";
import MessageLoading from "../Loaders/MessageLoading.jsx";
import Message from "./View/Messages.jsx";

function Messanger() {
    return (
        <>
            <Suspense fallback={<MessageLoading />}>
                <Message />
            </Suspense>
        </>
    )
}

export default Messanger
