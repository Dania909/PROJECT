import React, { useEffect, useState } from "react";

import Img1 from "../assets/wild/img1.jpg";
import Img2 from "../assets/wild/img2.jpg";
import Img3 from "../assets/wild/img3.jpg";
import Img4 from "../assets/wild/img4.jpg";
import Img5 from "../assets/wild/img5.jpg";
import Img6 from "../assets/wild/img6.jpg";
import Img7 from "../assets/wild/img7.jpg";
import Img8 from "../assets/wild/img8.jpg";
import Img9 from "../assets/wild/img9.jpg";
import Img10 from "../assets/wild/img10.jpg";
import Img11 from "../assets/wild/img11.jpg";
import Img12 from "../assets/wild/img12.jpg";
import Img13 from "../assets/wild/img13.jpg";
import Img14 from "../assets/wild/img14.jpg";

const frames = [
  Img1,
  Img2,
  Img3,
  Img4,
  Img5,
  Img6,
  Img7,
  Img8,
  Img9,
  Img10,
  Img11,
  Img12,
  Img13,
  Img14,
];

export function AnimatedWild({ trigger, size = 120 }) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let i = 0;
    setFrameIndex(0);

    const interval = setInterval(() => {
      i++;
      if (i < frames.length) {
        setFrameIndex(i);
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [trigger]);
  useEffect(() => {
    if (!trigger) return;

    let i = 0;
    setFrameIndex(0);

    const interval = setInterval(() => {
      i = (i + 1) % frames.length; // دائري بدل stop
      setFrameIndex(i);
    }, 80);

    return () => clearInterval(interval);
  }, [trigger]);

  return (
    <>
      <style>
        {`
          @keyframes zoomInOut {
            0%   { transform: scale(0.9); }
            50%  { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      <img
        src={frames[frameIndex]}
        alt="wild animation"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          pointerEvents: "none",
          animation: trigger ? "zoomInOut 1.5s ease-in-out" : "none",
        }}
      />
    </>
  );
}
