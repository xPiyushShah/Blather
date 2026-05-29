import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUserPlus, faBan } from "@fortawesome/free-solid-svg-icons";
import { useChatStore } from "../../store/useChatStore.js";

function MessageFe({ props, fun }) {
  const { selectedUser } = useChatStore();

  const renderMessageContent = () => {
    if (!selectedUser) return null;

    switch (props) {
      case "block":
        return (
          <>
            Please unblock {selectedUser.first_name}
            <FontAwesomeIcon icon={faBan} className="mr-2 " style={{fontSize: 9}}/>
          </>
        );

      case "add_frnd":
        return (
          <>
            {selectedUser.first_name} is not in your friends list
            <FontAwesomeIcon icon={faUserPlus} className="mr-2 " style={{fontSize: 9}}/>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="flex justify-center items-center opacity-80 w-full h-full cursor-pointer mt-5"
      onClick={fun}
    >
      <div className="max-w-[60%] min-w-fit bg-[#ffffff25] flex items-center gap-2 text-sm font-sans rounded-lg px-4 py-2" style={{font:"status-bar",padding:"9px"}}>
        {renderMessageContent()}
      </div>
    </div>
  );
}

export default MessageFe;
