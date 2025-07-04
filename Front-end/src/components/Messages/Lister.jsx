import React, { useEffect } from "react";

import { useChatStore } from "../../store/useChatStore.js";
import { authStore } from "../../store/authStore.js";
import { functionStore } from "../../store/functionStore.js";

import ProfileAvatar from "../ProfileAvatar.jsx";
import Friend from "../SideBar/Friend.jsx";
import ListSkelecton from "../SideBar/ListSkelecton.jsx";
import FriendUi from "../SideBar/FriendUi.jsx";

export default function Lister() {
  const {
    getUsers,
    getfriend,
    users,
    getMessages,
    selectedUser,
    isUserLoading,
    setSelctedUser,
    friendList,
    count,
    setUserLoading,
    isFriendLoading
  } = useChatStore();
  const { onlineUser, authUser, socket, addfriend } = authStore();
  const { isFriend } = functionStore();
  useEffect(() => {
    // getUsers();
    getfriend();
  }, [getfriend]);

  // useEffect(() => {
  //   getUsers();
  //   getfriend();
  // }, [getUsers, getfriend]);
  useEffect(() => { }, [socket]);
  return (
    <>
      <div className="border-b-[1px] border-b-[#dddddd35]  flex-row-reverse align-center text-center items-center  h-[12%]  justify-between w-full  hidden md:flex" style={{ padding: "12px 16px" }}>
        <div className="w-10 h-10">
          <ProfileAvatar onGen={authUser} />
        </div>
        {/* <div className="avatar text-center align-center">
            <div className="w-8 rounded-full">
              <img
                alt="me"
                src={authUser.profile_url || "https://res.cloudinary.com/dufcac38i/image/upload/v1750871808/user-3d-icon_642950-57_y7w2bq.jpg"}
              />
            </div>
          </div> */}
        <div className="icom">
          {authUser.first_name} {authUser.last_name}
        </div>
      </div>

      {isUserLoading && (<ListSkelecton />)}

      {!isUserLoading && <FriendUi />}

      {friendList.length == 0 && friendList.length < 0
        && (<ListSkelecton />)}


      {/* {isUserLoading && <ListSkelecton />}


      {/* {!isFriend ? <FriendUi /> : <Friend />}{friendList.length == 0} */}

    </>
  );
}
