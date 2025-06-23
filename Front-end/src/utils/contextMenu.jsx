import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { functionStore } from "../store/functionStore";

function contextMenu({ x, y }) {
  console.log(x)
  console.log(y)
  const { setSelctedUser, selectedUser } = useChatStore();
  const { setUsrId } = functionStore();
  return (
    // ${isNearBottom(index) ? "bottom-full mb-2" : "top-full mt-2"}
    <div
      className={`absolute bg-base-100 text-white border-0 shadow-md w-22 h-22 rounded z-50 text-sm message-options`}
       style={{ top: y, left: x }} >
      <ul className="flex flex-col justify-evenly w-full h-full gap-1">
        <li
          className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer"
          onClick={() => setUsrId(selectedUser)}>
          Profile
        </li>
        <li className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer">
          Block
        </li>
        <li
          className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer"
          onClick={() => setSelctedUser(null)}>
          Close Chat
        </li>
        {/* <li className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-500">
          {" "}
          Profile
        </li> */}
      </ul>
    </div>
  );
}

export default contextMenu;
