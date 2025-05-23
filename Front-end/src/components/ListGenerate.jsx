import React from "react";

export default function ListGenerate({ data, clicker }) {
  const isEmpty = !data || data.length === 0;
  const handleImageClick = (item) => {
    if (clicker) {
      clicker({ ...item, address: "Profile" });
    }
  };

  return (
    <>
      {isEmpty
        ? [...Array(2)].map((_, index) => (
            <div key={index} className="valup">
              <div>
                <div className="avatar skeleton-avatar text-center align-center">
                  <div className="w-8 h-8 mask mask-squircle bg-gray-300 animate-pulse" />
                </div>
              </div>
              <div className="icom">
                <div className="h-3 w-20 bg-gray-300 animate-pulse rounded shrink-0" />
              </div>
            </div>
          ))
        : data.map((item) => (
            <div key={item.id} className="valup" style={{ cursor: "pointer" }}>
              <div>
                <div
                  className={`avatar text-center align-center ${
                    item.id === 0 ? "avatar-online" : "avatar-offline"
                  }`}>
                  <div
                    className="w-8 mask mask-squircle"
                    onClick={() => handleImageClick(item)}>
                    <img alt={item.name} src={item.avatar} />
                  </div>
                </div>
              </div>
              <div className="icom" onClick={() => clicker && clicker(item)}>
                {item.name}
              </div>
            </div>
          ))}
    </>
  );
}
