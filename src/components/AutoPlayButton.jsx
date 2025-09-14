import React, { useState, useEffect, useRef } from "react";
import autoImg from "../assets/autoplay.png"; // صورة AutoPlay
import pauseImg from "../assets/pausee.png"; // صورة Pause

export default function AutoPlayButton({ startSpin, interval = 1500 }) {
  const [isAuto, setIsAuto] = useState(false);
  const intervalRef = useRef(null);

  const handleClick = () => {
    setIsAuto((prev) => !prev); // تبديل بين Auto ↔ Pause
  };

  useEffect(() => {
    if (isAuto) {
      intervalRef.current = setInterval(() => {
        if (startSpin) startSpin(); // كل فترة يدور Spin
      }, interval);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => clearInterval(intervalRef.current);
  }, [isAuto, interval, startSpin]);

  return (
    <button
      onClick={handleClick}
      className="relative w-16 h-16 flex items-center justify-center "
    >
      <img
        src={isAuto ? pauseImg : autoImg}
        alt={isAuto ? "Pause" : "AutoPlay"}
        className="w-12 h-11 object-contain"
      />
    </button>
  );
}
