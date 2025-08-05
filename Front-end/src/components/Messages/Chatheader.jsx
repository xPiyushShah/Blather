import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoCamera, faPhone } from "@fortawesome/free-solid-svg-icons";

import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import { callStore } from "../../store/callStore.js";

import ProfileAvatar from "../ProfileAvatar";

function Chatheader() {
    const { selectedUser } = useChatStore();
    const { onlineUser } = authStore();
    const { setModal } = callStore();
    return (
        <>
            <div className="bg-[var(--header-bg) flex shadow-lg flex-row justify-between w-full border-b-[1px] border-b-[#dddddd35] min-h-[73px] header-lest align-center text-center items-center overflow-hidden">
                <div className={`hidden md:flex mt-15 w-12 h-12 rounded-full hover:cursor-pointer`}>
                    <ProfileAvatar onGen={selectedUser} /> </div>
                <div className={`flex items-center  align-center text-center opacity-85 ${!selectedUser ? "skeleton" : ""} relative`}>
                    <span className={`${onlineUser.includes(selectedUser._id) ? "avatar-online" : "avatar-offline"} absolute top-0 left-0 right-14 w-6 h-6`}></span>
                    {`${selectedUser.first_name} ${selectedUser.last_name}`}
                </div>
                <div className={`lest-3 lest-apply ${!selectedUser ? "skeleton" : ""}`}>
                    <div className="opt  rounded-r-lg">
                        <FontAwesomeIcon
                            icon={faVideoCamera}
                            onClick={() => setModal("video")}
                        />
                    </div>
                    <div className="opt rounded-l-lg">
                        <FontAwesomeIcon icon={faPhone} onClick={() => setModal("audio")} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chatheader