import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import Profile from "./Profile/Profile";
import ChatContainer from "./Messages/ChatContainer";

const LeftBox = ({ onShow }) => {
  const data = [
    {
      id: 1,
      name: "Piyush Shah",
      src: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
    },
  ];
  return (
    <div className="lest-main flex-col">
      {onShow === "none" && (
        <div className="flex flex-col justify-center items-center h-full text-white-400 gap-4">
          <div className="rounded-xl align-center">
            <FontAwesomeIcon
              icon={faMessage}
              size="2x"
              className="flex space-x-4 bg-white-400"
            />
          </div>
          <p className="mt-4 text-sm">
            Start Your Conversation With Your Friends...
          </p>
        </div>
      )}
      {onShow === "text" && (
        <>
          <ChatContainer data={data} />
        </>
      )}
      {onShow === "Profile" && <Profile data={data} />}
    </div>
  );
};

export default LeftBox;
