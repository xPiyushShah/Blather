import React, { Suspense, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo } from "@fortawesome/free-solid-svg-icons";

import { useAuthStore } from "../../store/authStore.js";
import { useChatStore } from '../../store/useChatStore.js';
import { useCallStore } from '../../store/useCallStore.js';

import ProfileAvatar from '../Avatar/ProfileAvatar.jsx';


function MessagesHeder() {
    const { authUser, onlineSocktUser } = useAuthStore();
    const { selectedUser, messages } = useChatStore();
    const { setCallType, setCallScreen, initializeMedia } = useCallStore(); // call type is boolean value which is true for video call and false for audio call

    const callModalinitializer = async (val) => {
        // console.log("callmodalintialized with", val)
        setCallType(val);
        initializeMedia(true)
        await setCallScreen();
    }

    return (
        <>
            <div
                className="text-start w-full h-full bg-transparent flex items-center justify-between"
                style={{ padding: "6px 16px" }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center relative">
                        <ProfileAvatar user={selectedUser} />
                        <div
                            className={`
                  absolute -bottom-1 -right-1
                  w-2 h-2
                  rounded-full
                  border-2 border-[#1a1a1a]
                  shadow-md
                  ${onlineSocktUser.includes(selectedUser._id)
                                    ? 'bg-green-500 shadow-green-500/70'
                                    : 'bg-gray-400 shadow-gray-500/40'
                                }
                `}
                        />
                    </div>

                    <div className="w-32 h-[1px] lg:w-[1px] lg:h-6 bg-gray-400/50"></div>

                    <Suspense fallback={
                        <div className="h-3 w-20 bg-gray-300 animate-pulse rounded shrink-0" />
                    }>
                        <div className="text-sm font-semibold text-white">
                            {selectedUser
                                ? `${selectedUser.first_name} ${selectedUser.last_name}`
                                : "Unknown User"}
                        </div>
                    </Suspense>
                </div>

                {/* functional button on chat header such as calling */}
                <div className='flex items-center justify-center gap-0'>

                    <button className='w-10 h-10 flex items-center justify-center rounded-l-md bg-white/10 text-gray-300 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-95 shadow-md' onClick={() => callModalinitializer(false)}>
                        <FontAwesomeIcon icon={faPhone} />
                    </button>

                    <button className='w-10 h-10 flex items-center justify-center rounded-r-md bg-white/10 text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-95 shadow-md' onClick={() => callModalinitializer(true)}>
                        <FontAwesomeIcon icon={faVideo} />
                    </button>

                </div>

            </div>
        </>
    );
}

export default MessagesHeder;