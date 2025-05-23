import React, { useState } from "react";
import "../assets/Css/Home.css";
import LeftBox from "../components/LeftBox";
import SideBox from "../components/SideBox";

const Home = () => {
  const [mainPart, setMainPart] = useState("text");
  const taskHandler = (task) => {
    console.log(task);
  };
  return (
    <div className="main-root">
      <div className="root-start">
        <div className="root-element flex">
          <LeftBox onShow={mainPart} />
          <SideBox another={taskHandler} />
        </div>
      </div>
    </div>
  );
};

export default Home;
