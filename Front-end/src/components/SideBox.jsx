import React, { useState } from "react";
import "../assets/Css/Home.css";
import ToolSide from "./ToolSide";
import Lister from "./Messages/Lister";
import Star from "./Star";

export default function SideBox({ another }) {
  const [activeComponent, setActiveComponent] = useState("Lister");

  const handleClick = (name) => {
    if (activeComponent === name) setActiveComponent("Lister");
    else setActiveComponent(name);
  };
  const handleOpen = (data) => {
    if (data.address == "Profile") another(data);
    else console.log("From Lister:", data);
  };
  return (
    <div className="pest-main   flex justify-between">
      <div className="all">
        {activeComponent === "Lister" && <Lister onOpen={handleOpen} />}
        {activeComponent === "Star" && <Star />}
      </div>
      <div className="ball rounded-r-lg flex-column ">
        <ToolSide onClicked={handleClick} />
      </div>
    </div>
  );
}
