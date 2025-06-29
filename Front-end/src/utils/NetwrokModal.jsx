import React, { useEffect, useRef, useState } from "react";
import { useNetworkStore } from "../store/useNetworkStore";

export default function NetwrokModal({ close }) {
    const modalRef = useRef(null);

    const [usage, setUsage] = useState({
        axiosSent: 0,
        axiosReceived: 0,
        socketSent: 0,
        socketReceived: 0,
    });

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [effectiveType, setEffectiveType] = useState(null);

    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);

        const updateConnectionInfo = () => {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) setEffectiveType(connection.effectiveType || "wifi");
        };

        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        updateOnlineStatus();
        updateConnectionInfo();

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connection.addEventListener("change", updateConnectionInfo);
        }

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
            if (connection) {
                connection.removeEventListener("change", updateConnectionInfo);
            }
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setUsage(useNetworkStore.getState().getBandwidthUsage());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                close(); // Call the close function
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [close]);

    const format = (bytes) => {
        if (bytes > 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
        return (bytes / 1024).toFixed(2) + " KB";
    };

    const totalUpload = usage.axiosSent + usage.socketSent;
    const totalDownload = usage.axiosReceived + usage.socketReceived;

    return (
        <div
            ref={modalRef}
            className="ntwrk-bx absolute bg-base-100 text-white p-4 rounded shadow-md w-80 h-62 right-10 bottom-14 z-50 text-sm flex flex-col gap-2"
            style={{ padding: "6px" }}
        >
            <h4 className="font-bold text-lg">📶 Bandwidth Monitor</h4>
            <p>Status: <strong>{isOnline ? "Online ✅" : "Offline ❌"}</strong></p>
            <p>Network: <strong className="transform-uppercase">{effectiveType || "Unknown"}</strong></p>

            <div className="flex justify-between items-center bg-gray-800 rounded px-3 py-2">
                <span className="text-green-400 font-semibold">⬆️ Upload</span>
                <span>{format(totalUpload)}</span>
            </div>

            <div className="flex justify-between items-center bg-gray-800 rounded px-3 py-2">
                <span className="text-blue-400 font-semibold">⬇️ Download</span>
                <span>{format(totalDownload)}</span>
            </div>

            <hr className="border-gray-600 my-1" />

            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Axios Sent: <strong>{format(usage.axiosSent)}</strong></div>
                <div>Axios Received: <strong>{format(usage.axiosReceived)}</strong></div>
                <div>Socket Sent: <strong>{format(usage.socketSent)}</strong></div>
                <div>Socket Received: <strong>{format(usage.socketReceived)}</strong></div>
            </div>
        </div>
    );
}
