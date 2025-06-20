import React from "react";
const getRandomColor = () => {
  const colors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#845EC2"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function ProfileAvatar({ onGen }) {
  const initials = `${onGen.first_name?.[0] ?? ""}${
    onGen.last_name?.[0] ?? ""
  }`.toUpperCase();
  const bgColor = getRandomColor();

  return (
    <div className="flex align-center justify-center w-[40px] h-[40px] text-white text-center font-bold rounded-full "
      style={{
        backgroundColor: bgColor,
        fontSize: "16px",
        alignItems: "center",
      }}
      title={`${onGen.first_name} ${onGen.last_name}`}>
      {initials}
    </div>
  );
}
