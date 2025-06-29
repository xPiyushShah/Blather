import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoCamera, faPhone } from "@fortawesome/free-solid-svg-icons";

import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import { callStore } from "../../store/callStore.js";

import ProfileAvatar from "../ProfileAvatar";

function Chatheader() {
    const { selectedUser} = useChatStore();
    const { onlineUser } = authStore();
    const { setModal } = callStore();
    return (
        <>
            <div className=" flex flex-row justify-between w-full border-b-[1px] border-b-[#dddddd35] min-h-[72px] max-h-[78px] align-center text-center items-center">
                <div className={`hidden md:flex mt-15 w-20 rounded-full hover:cursor-pointer  avatar  align-center justify-center text-center relative`}>
                    <ProfileAvatar onGen={selectedUser} />
                    <div className={`${onlineUser.includes(selectedUser._id) ? "avatar-online" : "avatar-offline"} absolute top-11 left-13 w-6 h-6`}></div>
                </div>
                <div className={`flex items-center  align-center text-center opacity-85 ${!selectedUser ? "skeleton" : ""}`}>
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