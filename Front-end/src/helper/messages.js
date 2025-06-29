import CryptoJS from "crypto-js";
import { useChatStore } from "../store/useChatStore";
import { authStore } from "../store/authStore";


export const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const sent = new Date(timestamp);
    const diffMs = now - sent;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

export const msgCheck = (text) => {
    const key = useChatStore.getState().key;
    try {
        const bytes = CryptoJS.AES.decrypt(text, key);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted || text;
    } catch {
        return text;
    }
};
export const isNearBottom = (index, messages) => {
    const threshold = 2;
    return messages.length - index <= threshold;
};
export const getMessageId = (msg, index) => msg._id || msg.uid;

export const userExtract =  (data) => {

    const authUser = authStore.getState().authUser;
    // // const ano = authStore.getState().oneUser;
    if (data.senderId == authUser._id) {
        return "Me";
    }
    // try {
    //     const res = await axiosInstance.get("find-user", data);
    //     return res.data.first_name;         
    // } catch (error) {
    //     console.log(error);
    //     return "null";
    // }
    return "F";
};
