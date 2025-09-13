import { useState, useEffect, useMemo } from "react";
import coverImg from "../assets/cover.png";
import startBtn from "../assets/Start.png";

export default function Cover({ onStart }) {
  const [animate, setAnimate] = useState(false);

  // trigger the pulse every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      // remove the class after the animation duration (3s)
      setTimeout(() => setAnimate(false), 3000);
    }, 3000); // repeat every 3s
    return () => clearInterval(interval);
  }, []);

  // sparkles (same as before)
  const sparkles = useMemo(
    () =>
      Array.from({ length: 28 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 3 + Math.random() * 7,
        delay: Math.random() * 2,
        dur: 1.5 + Math.random() * 2,
      })),
    []
  );

  return (
    <div className="min-h-screen relative bg-[#08130f] overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${coverImg})` }}
      />
      <div className="absolute inset-0 bg-black/28" />

      {/* sparkles */}
      <div className="pointer-events-none absolute inset-0">
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="sparkle absolute rounded-full"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* START button */}
      <div className="absolute left-[43%] bottom-[1%]">
        <button onClick={onStart} className="relative">
          <span
            className={`inline-block ${
              animate ? "animate-pulseOnce" : ""
            }`}
          >
            <img
              src={startBtn}
              alt="Start"
              className="h-22 w-auto object-contain pointer-events-none select-none"
            />
          </span>
        </button>
      </div>

      <style>{`
        @keyframes pulseOnce {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-pulseOnce {
          animation: pulseOnce 3s ease-in-out;
        }

        @keyframes twinkle {
          0%,100% { opacity:.15; transform: scale(.8); filter: drop-shadow(0 0 2px #ffd957); }
          50%     { opacity:1;   transform: scale(1.3); filter: drop-shadow(0 0 6px #ffd957); }
        }
        .sparkle {
          background: radial-gradient(circle, #fff8c9 0%, #ffd957 40%, rgba(255,217,87,0) 70%);
          animation: twinkle 1.8s ease-in-out infinite;
          mix-blend-mode: screen;
        }
      `}</style>
    </div>
  );
}
