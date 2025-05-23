import React from "react";
import ListGenerate from "../ListGenerate";

export default function Lister({ onOpen }) {
  const data= [];
  const datass= [
    {
      id: 1,
      name: "Piyush Shah",
      avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
    },
    {
      id: 2,
      name: "Piyush Shah",
      avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
    },
    {
      id: 3,
      name: "Piyush Shah",
      avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp",
    },
   
  ];
  return (
    <>
      <div className="pest-header">
        <div className="">
          <div className="avatar text-center align-center">
            <div className="w-8 rounded-full">
              <img
                alt="me"
                src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
              />
            </div>
          </div>
        </div>
        <div className="icom">Piyush shah</div>
      </div>
      <div className="part-cont">
        <ListGenerate data={data} clicker={onOpen} />
      </div>
    </>
  );
}
