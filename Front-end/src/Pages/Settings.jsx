import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { authStore } from "../store/authStore";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants/index.js"

import Chatheader from "../components/Messages/Chatheader.jsx"
import Theme from "../components/Settings/Theme.jsx";
import "../index.css";

function Settings() {
  const { authUser } = authStore();
  const { theme, setTheme } = useThemeStore();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col  bg-base-100 align-center text-center  hover:cursor-resize w-full h-screen overflow-y-auto scroll-smooth ">
      <div className="header flex flex-row justify-between text-center bg-black
       relative text-white
      border-b-[2px] border-b-[#dddddd35]     w-full items-center  h-18" style={{ padding: "38px 56px" }}>
        <div className="icon flex align-center active:scale-90 transition-transform duration-150
        justify-center items-center bg-rose-500 w-25 h-full absolute left-18 cursor-pointer"
          onClick={() => {
            window.location.href = "/";
          }}>
          <FontAwesomeIcon
            icon={faArrowLeft}
          />
        </div>
        <div className="name capitalize text-xl absolute right-20">{authUser.first_name + " " + authUser.last_name}</div>
      </div>
      <div className="w-full h-full opacity-85 flex self-start " style={{ padding: "38px 66px" }}>
        <Theme />
      </div>
    </div >
  );
}

export default Settings;
