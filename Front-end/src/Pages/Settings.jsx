import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { authStore } from "../store/authStore";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants/index.js"

import Chatheader from "../components/Messages/Chatheader.jsx"
import "../index.css";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey!", isSent: false },
  { id: 2, content: "Who?", isSent: true },
];

function Settings() {
  const { authUser } = authStore();
  const { theme, setTheme } = useThemeStore();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col bg-base-100 align-center text-center  hover:cursor-resize w-full h-screen overflow-y-auto scroll-smooth">
      <div className="header flex flex-row justify-between text-center
      sticky top-0 right-0  text-white
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
        {/* theme container */}
        <div className="theme-shop w-full h-fit text-white" >
          <div className="flex flex-col gap-4  text-right justify-around relative">
            <span className="text-xl">Theme</span>
          </div>
          <div className={`collapse border border-base-300 collapse-open bg-green-600`} style={{ marginTop: '12px', padding: '16px' }} onClick={() => toggleAccordion('personal')}>
            <div className="collapse-title font-semibold text-black">Personal Info:</div>
            <div className="collapse-content text-sm">
              <div className=" w-full max-h-fit border" style={{ padding: "6px", marginTop: "28px" }} >
                <h3 className="text-lg font-semibold mb-3 text-left">Preview</h3>
                <div className="rounded-xl bg-black  border border-base-300 overflow-hidden bg-base-100 shadow-lg p-4 bg-base-200 max-w-lg mx-auto">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-base-300 bg-base-100" style={{ padding: "12px" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                        J
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">John Doe</h3>
                        <p className="text-xs text-base-content/70">Online</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id} className={`flex chat ${message.isSent ? "justify-end" : "justify-start"}  gap-6`} style={{ padding: "6px" }}>
                        <div className={`max-w-[80%] flex flex-col gap-1 rounded-sm p-3 shadow-sm ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`} >
                          <div style={{ padding: "8px" }} className="text-sm bg-red-400 rounded-sm w-18 h-fit" >{message.content}
                          </div>
                          <div className={` text-[10px] mt-1.5 ${message.isSent ? "text-primary-content/70" : "text-base-content/70"} `}>
                            12:00 PM
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-base-300 bg-base-100" style={{ padding: "16px" }}>
                    INPUT AREA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Settings;
