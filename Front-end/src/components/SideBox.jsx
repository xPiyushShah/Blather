import React, { useEffect, useState } from "react";
import "../assets/Css/Home.css";
import ToolSide from "./ToolSide";
import Lister from "./Messages/Lister";
import Star from "./Star";
import { functionStore } from "../store/functionStore";

export default function SideBox() {
  const [activeComponent, setActiveComponent] = useState("Lister");
  const { isStar } = functionStore();

  return (
    <div className="flex justify-between flex-row bg-[rgba(0,0,0,0.6)] w-2/5 h-screen overflow-auto transition-all duration-500 ease-in-out">
      <div className="h-full w-[90%]">
        {!isStar ? <Lister /> : <Star />}
      </div>
      <div
        className="flex flex-column relative h-full w-[10%] border-l-[1px] border-l-[#dddddd35]"
        style={{ padding: "13px" }}>
        <ToolSide />
      </div>
    </div>
  );
}
