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
    <div className="flex justify-between flex-row  w-2/5 h-full ">
      <div className="h-full w-[90%] overflow-hidden *:theme-aware-div">
        {!isStar ? <Lister /> : <Star />}
      </div>
      <ToolSide />
    </div>
  );
}
