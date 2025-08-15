import React, { useEffect } from 'react'
import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from '../../store/authStore.js';
import ProfileAvatar from "../ProfileAvatar";
function GlobalUi() {
    const { users, friendList, selectedUser, setSelctedUser, getUsers } = useChatStore();
    const { onlineUser, authUser, socket, addfriend } = authStore();
    useEffect(() => {
        getUsers();
    }, []);
    return (
        <>
            {users && (
                <div className="part-cont w-full h-full overflow-hidden transition-all duration-500 ease-in-out">
                    {users.length === 0 && (<div className='flex items-center justify-center h-full text-sm'>
                        <p>No users found</p>
                    </div>)}
                    {users?.map((item) => (
                        <div
                            key={item._id}
                            className={` h-[4rem] truncate  border-b-[1px] border-b-[#dddddd35] w-full flex flex-row justify-between items-center text-center ${selectedUser?._id === item._id
                                ? "bg-[var(--slct-user)] opacity-80 border-0 outline-0 text-base-content border-t-amber-100"
                                : ""
                                } mb-4`}
                            style={{ cursor: "pointer", padding: "2px 16px" }}
                            onClick={() =>
                                setSelctedUser(item)}>
                            <div>
                                <div
                                    className={`avatar text-center align-center ${onlineUser.includes(item._id)
                                        ? "avatar-online"
                                        : "avatar-offline"
                                        }`}>
                                    <div className="w-8 mask mask-squircle">
                                        <ProfileAvatar onGen={item} />
                                    </div>
                                </div>
                            </div>
                            <div className="icom ">{`${item.first_name} ${item.last_name}`}</div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default GlobalUi