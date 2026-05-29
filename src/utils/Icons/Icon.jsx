import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHeart, faStar, faRocket, faFire } from "@fortawesome/free-solid-svg-icons";


const Icon = ({ icon }) => {
  // const ic = iconsMap[icon];

  if (!ic) return null;
  return <FontAwesomeIcon icon={icon} />;
};

export default Icon;