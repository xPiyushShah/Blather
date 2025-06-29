import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faRightFromBracket,
  faStar,
  faBell,
  faThumbsUp,
  faUserFriends,
  faRadio,
  faUserNinja,
  faPalette,
  faWifi
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import { functionStore } from "../store/functionStore";
import NetwrokModal from "../utils/NetwrokModal"

export default function ToolSide() {
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
    setFriend,
  } = functionStore();
  const [logout, setLogout] = useState(false);
  const [network, setNetWork] = useState(false)
  const navigate = useNavigate();
  const { logOut } = authStore();
  const handleLogout = () => {
    setLogout(true);
    logOut("ok");
    navigate("/");
  };
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (!e.target.closest(".ntwrk-bx")) {
  //       setNetWork(null);
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);

  return (
    <div className="flex flex-column relative h-full w-[10%] border-l-[1px] border-l-[#dddddd35]" style={{ padding: "13px" }}>
      <div className="flex flex-col gap-6 align-end text-center items-center absolute b-0 self-end-safe mb-6 *:sm:mb-0  sm:left-0 sm:right-0 sm:flex-col sm:justify-between  sm:absolute sm:b-0">
        {/* <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faThumbsUp} onClick={() => onClicked("theme")} />
        </div>*/}
        <div className=" pk rounded-xl align-start">
          <FontAwesomeIcon
            icon={faUserNinja}
            onClick={setProfile}
            style={{ color: isProfile ? "lightblue" : "" }}
          />
        </div>
        {/* <div className=" pk rounded-xl ">
          <FontAwesomeIcon icon={faRadio} onClick={setRoom} style={{ color: isRoom ? "lightblue" : "" }} />
        </div> */}
        {/* <div className=" pk rounded-xl">
          <FontAwesomeIcon
            icon={faUserFriends}
            onClick={setFriend}
            style={{ color: isFriend ? "lightblue" : "" }}
          />
        </div> */}
        <div className=" pk rounded-xl">
          <FontAwesomeIcon
            icon={faBell}
            onClick={setNotify}
            style={{ color: isNotify ? "lightblue" : "" }}
          />
        </div>
        <div className=" pk rounded-xl">
          <FontAwesomeIcon
            icon={faStar}
            onClick={setStar}
            style={{ color: isStar ? "lightblue" : "" }}
          />
        </div>
        <div className="divider  oper sm:p-[12px]"></div>
        <div className=" pk rounded-xl hover:rotate-60 transition-all ease-in-out  delay-200 duration-300">
          <Link to="/setting" >
            <FontAwesomeIcon
              icon={faGear}
            />
          </Link>
        </div>
        {/* <div className="rounded-xl pk">
          <FontAwesomeIcon icon={faPalette}  />
        </div> */}
        <div className={`rounded-xl pk  transition-all ease-in-out  delay-200 duration-300`}>
          <FontAwesomeIcon icon={faWifi} onClick={(prev) => setNetWork(prev => !prev)} style={{ color: network ? "lightblue" : "" }} />
        </div>
        {network && <NetwrokModal close={setNetWork} />}
        <div className="rounded-xl pk">
          <FontAwesomeIcon icon={faRightFromBracket} onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
