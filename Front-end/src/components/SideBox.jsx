import React, { useEffect, useState } from "react";
import "../assets/Css/Home.css";
import ToolSide from "./ToolSide";
import Lister from "./Messages/Lister";
import Star from "./Star";
import { functionStore } from "../store/functionStore";

export default function SideBox() {
  const [activeComponent, setActiveComponent] = useState("Lister");
  const { isStar,isNarrow } = functionStore();

  return (
    <div className={`flex justify-between flex-row  transition-transform duration-400 ${isNarrow ? 'w-[20%] transition-transform duration-400' : 'w-2/5'} h-full bg-[rgba(0,0,0,0.6)]`}>
      <div className={`h-full transition-transform duration-400 ${isNarrow ? 'w-[90%] transition-transform duration-300' : 'w-[90%]'} overflow-hidden *:theme-aware-div ddbox`}>
        {!isStar ? <Lister /> : <Star />}
      </div>
      <ToolSide />
    </div>
  );
}
