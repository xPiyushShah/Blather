import React from "react";

function ListSkelecton() {
  return (
    <>
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className="h-[4rem] border-b-[1px] border-b-[#dddddd35] w-full flex flex-row justify-between items-center text-center"
          style={{ padding: "2px 16px" }}>
          <div>
            <div className="avatar skeleton-avatar text-center align-center">
              <div className="w-8 h-8 mask mask-squircle bg-gray-300 animate-pulse" />
            </div>
          </div>
          <div className="icom">
            <div className="h-3 w-20 bg-gray-300 animate-pulse rounded shrink-0" />
          </div>
        </div>
      ))}
    </>
  );
}

export default ListSkelecton;
