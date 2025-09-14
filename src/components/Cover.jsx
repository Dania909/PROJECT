import { useState, useEffect, useMemo } from "react";
import coverImg from "../assets/cover.png";
import startBtn from "../assets/Start.png";

export default function Cover({ onStart }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 3000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen relative bg-[#08130f] overflow-hidden flex items-center justify-center">
      <div className="relative w-[min(1400px,95vw)]">
        <img
          src={coverImg}
          alt="Cover"
          className="block w-full h-auto object-contain pointer-events-none select-none"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/28" />

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
<div
  className="
    absolute
    left-1/2 -translate-x-1/2 bottom-[0.35%]    /* mobile: smaller & lower */
    sm:left-[38%] sm:translate-x-0 sm:bottom-[1.4%]  /* tablet */
    md:left-[43.2%] md:bottom-[1.2%]                   /* md */
    lg:left-[43%] lg:bottom-[0.8%]                   /* desktop */
  "
>
  <button onClick={onStart} className="relative">
    <span className={`inline-block ${animate ? "animate-pulseOnce" : ""}`}>
      <img
        src={startBtn}
        alt="Start"
        className="
          h-4 w-auto      /* mobile: smaller */
          sm:h-11         /* tablet */
          md:h-12         /* md */
          lg:h-22         /* desktop */
          object-contain pointer-events-none select-none
        "
      />
    </span>
  </button>
</div>

      </div>

      <style>{`
        @keyframes pulseOnce {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-pulseOnce { animation: pulseOnce 3s ease-in-out; }
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
