import React from "react";
import { functionStore } from "../store/functionStore.js";
import { authStore } from "../store/authStore.js";

function Star() {
  const { starredMessages } = functionStore();
  const { authUser } = authStore();
  return (
    <>
      <div className="flex align-center text-center bg-transparent hover:cursor-resize color-green-400">
        <div className="w-full h-full text-center  transform-upperacse">
          <div
            className="border-b-[1px] border-b-[#dddddd35] h-[4rem] text-left text-bold transform-upperacse 
          bg-base-100 align-center justify-center"
            style={{ padding: "14px 28px" }}>
            Star Messages
          </div>
          {starredMessages.map((data, index) => {
            return (
              <div
                className="h-[3rem] border-b-[1px] border-b-[#dddddd35] text-wrap hover:cursor-pointer justify-items-start text-white w-full flex flex-row gap-2 p-4 "
                style={{ padding: "12px 22px " }}>
                <p className="text-left text-[12px] opacity-30"> {index + 1}</p>
                <p className="text-left"> {data.text}</p>
                <p className="text-right text-[12px] opacity-30 mr-28">
                  {data.senderId == authUser._id ? "Me" : data.receiverId}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Star;
