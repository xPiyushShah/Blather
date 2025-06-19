import React from "react";
import { authStore } from "../../store/authStore";
import { useChatStore } from "../../store/useChatStore";
import ListSkelecton from "./ListSkelecton";
import ProfileAvatar from "../ProfileAvatar";

function FriendUi() {
  const { users, friendList, selectedUser , setSelctedUser} = useChatStore();
    const { onlineUser, authUser, socket, addfriend } = authStore();
  return (
    <>
      {friendList && (
        <div className="part-cont">
          {friendList?.map((item) => (
            <div
              key={item._id}
              className={`h-[4rem] border-b-[1px] border-b-[#dddddd35] w-full flex flex-row justify-between items-center text-center ${
                selectedUser === item._id
                  ? "bg-red-300 ring-1 ring-base-300 "
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
                    {item.profile_url ? (
                      <img
                        alt={`${item.first_name} ${item.last_name}`}
<<<<<<< HEAD
                        src={item.profile_url}
=======
                        src={item.profile_url}
>>>>>>> 23f6cffcf94da4a415bbe2c7f59a5efec44b885e
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
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default FriendUi;
