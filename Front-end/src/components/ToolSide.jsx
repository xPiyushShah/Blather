import React, { useState } from "react";
import "../assets/Css/ToolSide.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faRightFromBracket,
  faStar,
  faBell,
  faUserPlus,
  faThumbsUp
} from "@fortawesome/free-solid-svg-icons";
export default function ToolSide({ onClicked }) {
  return (
    <>
      <div className="aa">
        <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faThumbsUp} onClick={() => onClicked("theme")} />
        </div>
        <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faUserPlus} onClick={() => onClicked("add")} />
        </div>
        <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faBell} onClick={() => onClicked("bell")} />
        </div>
        <div className=" pk rounded-xl">
          <FontAwesomeIcon icon={faStar} onClick={() => onClicked("Star")} />
        </div>
        <div className=" pk rounded-xl hover:rotate-60 transition-all ease-in-out  delay-200 duration-300">
          <FontAwesomeIcon icon={faGear} />
        </div>
        <div className="rounded-xl pk">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      </div>
    </>
  );
}
