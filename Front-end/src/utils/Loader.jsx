import React, { useEffect, useState } from "react";

const Loader = () => {
  const texts = ["Welcome", "To","Blather"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [slidingOutUnderline, setSlidingOutUnderline] = useState(false);

  const currentText = texts[currentTextIndex];

  useEffect(() => {
    let letterInterval;

    if (!isSlidingOut) {
      letterInterval = setInterval(() => {
        setVisibleLetters((prev) => {
          if (prev < currentText.length) {
            return prev + 1;
          } else {
            clearInterval(letterInterval);
            setTimeout(() => {
              if (currentText === "Welcome") {
                setSlidingOutUnderline(true);
              }
              setTimeout(() => {
                setIsSlidingOut(true);
                setTimeout(() => {
                  setIsSlidingOut(false);
                  setSlidingOutUnderline(false);
                  setVisibleLetters(0);
                  setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
                }, 500);
              }, 300);
            }, 1000);
          }
          return prev;
        });
      }, 150);
    }

    return () => clearInterval(letterInterval);
  }, [currentTextIndex, isSlidingOut, currentText]);

  const getLetterColor = (index, text) => {
    if (index === 0) {
      if (text === "Welcome") return "text-blue-500";
      if (text === "Blather") return "text-red-500";
    }
    return "text-white";
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="hidden md:flex flex-col items-center">
        {/* Word display */}
        <div
          className={`flex flex-row text-center transition-transform duration-500 ease-in-out`}
          style={{
            transform: isSlidingOut ? "translateX(-150%)" : "translateX(0)",
          }}
        >
          {currentText.split("").map((letter, index) => (
            <span
              key={index}
              className={`text-4xl font-bold transition-all duration-300 ease-out transform ${
                index < visibleLetters
                  ? "translate-y-0 opacity-100 scale-100"
                  : "-translate-y-10 opacity-0 scale-50"
              } ${getLetterColor(index, currentText)}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Underline only for "Welcome" */}
        {currentText === "Welcome" && (
          <div
            className={`h-1 bg-blue-500 mt-2 transition-all duration-500 ease-in-out`}
            style={{
              width:
                visibleLetters === currentText.length
                  ? `${currentText.length * 1.6}rem`
                  : "0rem",
              opacity:
                visibleLetters === currentText.length ? 1 : 0,
              transform: slidingOutUnderline
                ? "translateX(150%)"
                : "translateX(0)",
            }}
          ></div>
        )}
      </div>

      {/* Message for small screens */}
      <div className="md:hidden absolute bottom-10 text-center text-white text-xl px-4">
        Please use a laptop or PC to view this application.
      </div>
    </div>
  );
};

export default Loader;
