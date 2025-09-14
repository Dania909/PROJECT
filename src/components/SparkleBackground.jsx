import { useMemo } from "react";

export default function SparkleBackground() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 2,
        dur: 1.5 + Math.random() * 2,
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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

      <style>{`
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
