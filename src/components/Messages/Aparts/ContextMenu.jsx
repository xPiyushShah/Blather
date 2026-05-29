import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../../store/useChatStore";
import { useFunction } from "../../../store/useFunction";

function contextMenu({ data, onClose }) {

  const { setSelectedUser, selectedUser } = useChatStore();
  const { selectMsg, setSelectMsg } = useFunction();
  const { setUsrId } = useFunction();
  const [menuHeight, setMenuHeight] = useState(0);

  return (

    <div
      className={`bg-[#24c37b94] absolute text-white border-0 shadow-md w-32 min-h-22 max-h-fit  z-50 text-sm text-center rounded-md`}
      style={{
        // top: y,
        // left: x,
        // padding: "4px"
        left: data.x,
        top: data.openUpwards ? "auto" : data.y,
        bottom: data.openUpwards ? 0 : "auto",
      }}>
      <ul className="flex flex-col justify-evenly w-full h-full gap-2 " style={{ padding: "2px 6px" }}>
        <li
          className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer"
          onClick={() => setSelectMsg(true)}>
          {!selectMsg ? "Select message" : "Deselect message"}
        </li>
        <li
          className="hover:bg-base-content hover:text-black hover: px-4 py-2 cursor-pointer"
          onClick={() => setUsrId(selectedUser)}>
          Profile
        </li>
        <li className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer">
          Block
        </li>
        <li
          className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer"
          onClick={() => setSelectedUser(null)}>
          Close Chat
        </li>
        <li
          className="hover:bg-base-content hover:text-black px-4 py-2 cursor-pointer"
          onClick={() => onClose()}>
          Close
        </li>
        {/* <li className="hover:bg-red-100 px-4 py-2 cursor-pointer text-red-500">
          {" "}
          Profile
        </li> */}
      </ul>
    </div >
  );
}

export default contextMenu;
