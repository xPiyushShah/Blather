import React, { useEffect } from "react";

import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import { functionStore } from "../../store/functionStore.js";

import ProfileAvatar from "../ProfileAvatar.jsx";

export default function Lister() {
  const {
    getUsers,
    users,
    getMessages,
    selectedUser,
    isUserLoading,
    setSelctedUser,
    count,
  } = useChatStore();
  const { onlineUser, authUser, socket , addfriend } = authStore();
  const { isFriend } = functionStore();
  useEffect(() => {
    getUsers();
    // getMessages(selectedUser);
  }, [getUsers]);
  useEffect(() => {}, [socket]);
  return (
    <>
      {!isFriend ? (
        <div
          className="border-b-[1px] border-b-[#dddddd35] flex flex-row-reverse align-center text-center items-center 
      h-[12%]  justify-between w-full "
          style={{ padding: "12px 16px" }}>
          <div>
            <div className="avatar text-center align-center">
              <div className="w-8 rounded-full">
                <img
                  alt="me"
                  src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                />
              </div>
            </div>
          </div>
          <div className="icom">{`${authUser.first_name} ${authUser.last_name}`}</div>
        </div>
      ) : (
        <div
          className="border-b-[1px] border-b-[#dddddd35] flex flex-row-reverse align-center text-center items-center 
      h-[12%]  justify-between w-full "
          style={{ padding: "12px 16px" }}>
          <div className="icom text-bold fam">Add friend's</div>
        </div>
      )}
      {isUserLoading &&
        [...Array(2)].map((_, index) => (
          <div
            key={index}
            className="h-[4rem] border-b-[1px] border-b-[#dddddd35] w-full flex flex-row justify-between items-center text-center"
            style={{ padding: "2px 16px" }}>
            <div>
              <div className="avatar skeleton-avatar text-center align-center">
                <div className="w-8 h-8 mask mask-squircle bg-gray-300 animate-pulse" />
              </div>
            </div>
            <div className="icom">
              <div className="h-3 w-20 bg-gray-300 animate-pulse rounded shrink-0" />
            </div>
          </div>
        ))}
      {!isFriend ? (
        <div className="part-cont">
          {users?.map((item) => (
            <div
              key={item._id}
              className={`h-[4rem] border-b-[1px] border-b-[#dddddd35] w-full flex flex-row justify-between items-center text-center ${
                selectedUser === item._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              } mb-4`}
              style={{ cursor: "pointer", padding: "2px 16px" }}
              onClick={() => setSelctedUser(item)}>
              <div>
                <div
                  className={`avatar text-center align-center ${
                    onlineUser.includes(item._id)
                      ? "avatar-online"
                      : "avatar-offline"
                  }`}>
                  <div className="w-8 mask mask-squircle">
                    {item.avatar ? (
                      <img
                        alt={`${item.first_name} ${item.last_name}`}
                        src={item.avat}
                      />
                    ) : (
                      <ProfileAvatar onGen={item} />
                    )}
                    <img
                      alt={`${item.first_name} ${item.last_name}`}
                      src={item.avatar}
                    />
                  </div>
                </div>
              </div>
              <div className="icom">{`${item.first_name} ${item.last_name}`}</div>
            </div>
          ))}
        </div>
      ) : (
        // this one is for ADD FRIEND
        users?.map((item) => (
          <div
            key={item._id}
            className={`h-[4rem] border-b-[1px] border-b-[#dddddd35] w-full flex flex-row justify-between items-center text-center ${
              selectedUser === item._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            } mb-4`}
            style={{ cursor: "pointer", padding: "2px 16px" }}>
            <div>
              <div
                className={`avatar text-center align-center ${
                  onlineUser.includes(item._id)
                    ? "avatar-online"
                    : "avatar-offline"
                }`}>
                <div className="w-8 mask mask-squircle">
                  {item.avatar ? (
                    <img
                      alt={`${item.first_name} ${item.last_name}`}
                      src={item.avat}
                    />
                  ) : (
                    <ProfileAvatar onGen={item} />
                  )}
                  <img
                    alt={`${item.first_name} ${item.last_name}`}
                    src={item.avatar}
                  />
                </div>
              </div>
            </div>
            <div className="icom">{`${item.first_name} ${item.last_name}`}</div>
            <div className="icom">
              <button
                className="bg-green-200 text-black w-14 h-8 rounded-lg font-semibold cursor-pointer"
                onClick={() => addfriend(item._id)}>
                ADD
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}
