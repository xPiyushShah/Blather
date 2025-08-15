import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

export default function BlankMessage() {
  return (
    <div className="flex flex-col justify-center items-center h-full text-white-400 gap-4 opacity-45">
      <div className="rounded-xl align-center ">
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
  );
}
