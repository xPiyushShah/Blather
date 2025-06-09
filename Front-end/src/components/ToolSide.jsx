import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faRightFromBracket,
  faStar,
  faBell,
  faThumbsUp,
  faUserFriends,
  faRadio,
  faUserNinja
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import { functionStore } from "../store/functionStore";

export default function ToolSide({ onClicked }) {
  const {
    setNotify,
    setRoom,
    setSetting,
    setStar,
    setProfile,
    isStar,
    isNotify,
    isProfile,
    isSetting,
    isRoom,
    isFriend,
    setFriend
  } = functionStore();
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();
  const { logOut } = authStore();
  const handleLogout = () => {
    setLogout(true);
    logOut("ok");
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col gap-6 align-end text-center items-center absolute b-0 self-end-safe mb-6">
        {/* <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faThumbsUp} onClick={() => onClicked("theme")} />
        </div>*/}
        <div className=" pk rounded-xl align-start">
          <FontAwesomeIcon icon={faUserNinja} onClick={setProfile} style={{ color: isProfile ? "lightblue" : "" }}  />
        </div>
        {/* <div className=" pk rounded-xl ">
          <FontAwesomeIcon icon={faRadio} onClick={setRoom} style={{ color: isRoom ? "lightblue" : "" }} />
        </div> */}
        <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faUserFriends} onClick={setFriend} style={{ color: isFriend ? "lightblue" : "" }} />
        </div>
        <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faBell} onClick={setNotify} style={{ color: isNotify ? "lightblue" : "" }} />
        </div>
        <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faStar} onClick={setStar} style={{ color: isStar ? "lightblue" : "" }} />
        </div>
        <div className="divider  oper"></div>
        <div className=" pk rounded-xl hover:rotate-60 transition-all ease-in-out  delay-200 duration-300">
          <FontAwesomeIcon icon={faGear} onClick={setSetting} style={{ color: isSetting ? "lightblue" : "" }} />
        </div>
        <div className="rounded-xl pk">
          <FontAwesomeIcon icon={faRightFromBracket} onClick={handleLogout} />
        </div>
      </div>
    </>
  );
}
