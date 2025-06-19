import React from "react";
import { authStore } from "../../store/authStore";
import { useChatStore } from "../../store/useChatStore";
import ProfileAvatar from "../ProfileAvatar";
import ListSkelecton from "./ListSkelecton";

function Friend() {
  const { users, friendList, selectedUser, pend_users } = useChatStore();
  const { onlineUser, authUser, socket, addfriend, acceptfriend } = authStore();
  return (
    <>
      {users.length == 0 && (<ListSkelecton />)}
      {/* Request List */}

      {pend_users?.map((item) => (
        <div
          key={item._id}
          className={`h-[4rem] border-b-[1px] border-b-[#dddddd35] w-full flex flex-row justify-between items-center text-center ${
            selectedUser === item._id ? "bg-base-300 ring-1 ring-base-300" : ""
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
                {item.profile_url ? (
                  <img
                    alt={`${item.first_name} ${item.last_name}`}
                    src={item.profile_url}
                  />
                ) : (
                  <ProfileAvatar onGen={item} />
                )}
                <img
                  alt={`${item.first_name} ${item.last_name}`}
                  src={item.profile_url}
                />
              </div>
            </div>
          </div>
          <div className="icom">{`${item.first_name} ${item.last_name}`}</div>

          <div className="icom">
            <button
              className="bg-green-200 text-black w-28 h-8 rounded-lg font-semibold cursor-pointer"
              onClick={() => acceptfriend(item._id)}>
              ACCEPT
            </button>
          </div>
        </div>
      ))}

      {/* Gloabal Users - list all */}
      {users?.map((item) => (
        <div
          key={item._id}
          className={`h-[4rem] border-b-[1px] border-b-[#dddddd35] w-full flex flex-row justify-between items-center text-center ${
            selectedUser === item._id ? "bg-base-300 ring-1 ring-base-300" : ""
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
                {item.profile_url ? (
                  <img
                    alt={`${item.first_name} ${item.last_name}`}
                    src={item.profile_url}
                  />
                ) : (
                  <ProfileAvatar onGen={item} />
                )}
                <img
                  alt={`${item.first_name} ${item.last_name}`}
                  src={item.profile_url}
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
      ))}
    </>
  );
}

export default Friend;
