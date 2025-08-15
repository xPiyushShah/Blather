import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoCamera, faPhone, faUserPlus, faArrowDown, faClock } from "@fortawesome/free-solid-svg-icons";

import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import { callStore } from "../../store/callStore.js";

import ProfileAvatar from "../ProfileAvatar";
import FrndStatus from '../ChatPart/FrndStatus.jsx';

function Chatheader() {
    const { selectedUser, MyFrndStatus, getFriendStatus, addfriend } = useChatStore();
    const { onlineUser, authUser } = authStore();
    const { setModal } = callStore();


    const extracter = (data) => {
        if (!data) {
            return {
                name: "",
                id: "",
                status: "not_found",
                created_by: ""
            };
        }
        // Extract relevant information from the data
        const friend_status = data.friendship.status;
        const friend_id = data.u_data._id;
        const friend_name = `${data.u_data.first_name} ${data.u_data.last_name}`;
        return {
            name: friend_name,
            id: friend_id,
            status: friend_status.status,
            created_by: data.u_data.createdBy
        }
    };
    // let rv_data = null;
    useEffect(() => {
        const rv_data = extracter(MyFrndStatus);
    }, [MyFrndStatus]);
    const add_friend = async (id) => {
        await addfriend(id)
            .then(() => {
                getFriendStatus(id);
            })
            .catch((error) => {
                console.error("Error adding friend:", error.message);
            });
    };
    return (
        <>
            <div className="bg-[var(--header-bg)] flex shadow-lg flex-row justify-between w-full border-b-[1px] z-[1px] border-b-[#dddddd35] min-h-[72px] header-lest align-center text-center items-center overflow-hidden">
                <div className={`hidden md:flex mt-15 w-12 h-12 rounded-full hover:cursor-pointer`}>
                    <ProfileAvatar onGen={selectedUser} /> </div>
                <div className={`flex items-center  align-center text-center opacity-85 ${!selectedUser ? "skeleton" : ""} relative`}>
                    {/* <span className={`${onlineUser.includes(selectedUser._id) ? "avatar-online" : "avatar-offline"} absolute top-0 left-0 right-14 w-6 h-6`}></span>*/}
                    {`${selectedUser.first_name} ${selectedUser.last_name}`}
                </div>
                {/* Friend Action Buttons */}
                <div className={`lest-3 lest-apply ${!selectedUser ? "skeleton" : ""}`}>
                    <FrndStatus />
                </div>
            </div>
        </>
    )
}

export default Chatheader