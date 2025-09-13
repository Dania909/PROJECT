import React, { useEffect, useMemo, useState, useRef } from "react";

// ===== ASSETS (adjust paths if needed) =====
import BG from "../assets/GambleBackground.png";
import Title from "../assets/GambleTitle.png";
import BtnCollect from "../assets/CollectButton.png";
import BtnGamble from "../assets/GambleButton.png";   // or ../assets/GambleGreen.png
import CoinWin from "../assets/GambleWin.png";
import CoinLose from "../assets/GaambleLoss.png";   
import StepGreen from "../assets/GambleGreen.png";
// note the double “a”

/* Ladder: start 10 → try for 15/20/30/50.
   Lose fallbacks: 5 / 10 / 10 / 10 (ends on lose). */
const LADDER = [
  { win: 15, lose: 5 },
  { win: 20, lose: 10 },
  { win: 30, lose: 10 },
  { win: 50, lose: 10 },
];

export default function GambleModal({ open, initialSpins = 10, onCollect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSpins, setCurrentSpins] = useState(initialSpins);
  const [ended, setEnded] = useState(false);

  // flip state
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastOutcome, setLastOutcome] = useState(null); // 'win' | 'lose' | null
  const [flipFace, setFlipFace] = useState("win");      // what to show while flipping
  const flipTimer = useRef(null);
  const settleTimer = useRef(null);

  // ========= same pulse timing as your Buy/Cancel =========
  const [animateAction, setAnimateAction] = useState(false);
  useEffect(() => {
    const PULSE_MS = 1200;
    const INTERVAL_MS = 3500;
    const tick = () => {
      setAnimateAction(true);
      setTimeout(() => setAnimateAction(false), PULSE_MS);
    };
    const kickoff = setTimeout(tick, 800);
    const interval = setInterval(tick, INTERVAL_MS);
    return () => { clearTimeout(kickoff); clearInterval(interval); };
  }, []);
  // ========================================================

  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setCurrentSpins(initialSpins);
      setEnded(false);
      setIsFlipping(false);
      setLastOutcome(null);
      setFlipFace("win");
    }
    return () => {
      if (flipTimer.current) clearInterval(flipTimer.current);
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, [open, initialSpins]);

  // keep enabled until we explicitly end
  const canGamble = open && !ended;

  const step = LADDER[currentIndex];
  const topBanner = useMemo(() => ["15", "20", "30", "50"], []);

  if (!open) return null;

  function doGamble() {
    if (!canGamble || isFlipping) return;

    setIsFlipping(true);
    setLastOutcome(null);

    // alternate faces quickly while flipping
    flipTimer.current = setInterval(() => {
      setFlipFace((f) => (f === "win" ? "lose" : "win"));
    }, 110);

    // settle on a result
    settleTimer.current = setTimeout(() => {
      clearInterval(flipTimer.current);
      const win = Math.random() < 0.5; // keep 50/50 concept
      setLastOutcome(win ? "win" : "lose");
      setIsFlipping(false);

      if (win) {
        // if this win would move us INTO the last step (50), end immediately with 50 spins
        const nextIndex = Math.min(currentIndex + 1, LADDER.length - 1);
        if (nextIndex === LADDER.length - 1) {
          setCurrentIndex(nextIndex);
          setCurrentSpins(LADDER[LADDER.length - 1].win); // 50
          setEnded(true); // ✅ no extra gamble after reaching 50
        } else {
          setCurrentSpins(step.win);
          setCurrentIndex(nextIndex);
        }
      } else {
        setCurrentSpins(step.lose);
        setEnded(true);
      }
    }, 1400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* CONTAINER: bigger, and background image NOT cropped */}
      <div className="relative w-[min(95vw,880px)] aspect-[880/560] rounded-2xl overflow-hidden shadow-2xl bg-transparent">
        {/* Background as image so it's never cut */}
        <img
          src={BG}
          alt=""
          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
        />

        {/* Title smaller */}
        <img
          src={Title}
          alt="GAMBLE TO GET"
          className="absolute left-1/2 -translate-x-1/2 top-9 w-[35%] pointer-events-none select-none drop-shadow"
        />

        {/* Ladder boxes: always same size (use the green image for both) */}
        <div className="absolute top-27 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {topBanner.map((v, i) => (
            <div key={v} className="relative w-10 h-10">
              {/* background: green if active/complete, else same image darkened */}
              <img
                src={StepGreen}
                alt=""
                className={`absolute inset-0 h-full w-full object-contain pointer-events-none select-none ${
                  i <= currentIndex ? "" : "brightness-0" // inactive → blacked out
                }`}
              />

              {/* big gold number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-yellow-300 font-extrabold text-base drop-shadow">
                  {v}
                </span>
              </div>

              {/* small white number (nudged slightly right) */}
              <div className="absolute bottom-1 text-[8px] font-bold text-white translate-x-1">
                {LADDER[i].lose}
              </div>
            </div>
          ))}
        </div>

        {/* ===== UPDATED: coin sizes, positions, and labels ===== */}
        <div className="absolute inset-x-0 top-[28%] flex items-center justify-center gap-34">
          {/* LOSE coin + label */}
          <div className="flex flex-col items-center">
            <StaticCoin img={CoinLose} label={`${step?.lose ?? ""}`} size="sm" />
            <div className="mt-1 font-extrabold text-yellow-300 leading-tight w-full">
              <div className="text-lg text-center -translate-x-2">{step?.lose}</div>
              <div className="text-sm text-left -mt-1">FREE SPINS</div>
            </div>
          </div>

          {/* WIN coin + label */}
          <div className="flex flex-col items-center">
            <StaticCoin img={CoinWin} label={`${canGamble ? step.win : currentSpins}`} size="sm" />
            <div className="mt-1 font-extrabold text-yellow-300 leading-tight w-full">
              <div className="text-lg text-center translate-x-2">{canGamble ? step.win : currentSpins}</div>
              <div className="text-sm text-right -mt-1">FREE SPINS</div>
            </div>
          </div>
        </div>

        {/* FLIPPING coin a bit SMALLER and LOWER */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[49%]">
          <FlippingCoin
            isFlipping={isFlipping}
            faceWhenFlipping={flipFace}
            finalOutcome={lastOutcome}
            winImg={CoinWin}
            loseImg={CoinLose}
            size="md"
          />
        </div>

        {/* Buttons (images only) — same size & higher */}
        <div className="absolute inset-x-0 bottom-16 flex items-center justify-center gap-6">
          {/* COLLECT */}
          <button
            onClick={() => onCollect?.(currentSpins)}
            className={`relative h-20 w-64 active:scale-95 transition ${animateAction ? "animate-pulseOnce" : ""}`}
            aria-label={`Collect ${currentSpins} Free Spins`}
          >
            <img
              src={BtnCollect}
              alt=""
              className="absolute inset-0 h-full w-full object-contain object-center pointer-events-none select-none"
            />
          </button>

          {/* GAMBLE */}
          <button
            disabled={!canGamble}
            onClick={doGamble}
            className={`relative h-19 w-64 active:scale-95 transition ${canGamble ? "" : "opacity-60 cursor-not-allowed"} ${animateAction ? "animate-pulseOnce" : ""}`}
            aria-label="Gamble"
          >
            <img
              src={BtnGamble}
              alt=""
              className="absolute inset-0 h-full w-full object-contain object-center pointer-events-none select-none transform-gpu scale-90"
            />
          </button>
        </div>
      </div>

      {/* subtle 3D spin + pulseOnce */}
      <style>{`
        @keyframes coin-tilt {
          0%   { transform: rotateY(0deg)   scale(1); }
          50%  { transform: rotateY(180deg) scale(0.96); }
          100% { transform: rotateY(360deg) scale(1); }
        }
        /* One-shot pulse (same timing/shape as your Buy/Cancel) */
        @keyframes pulseOnceKF {
          0%   { transform: scale(1); }
          45%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-pulseOnce {
          animation: pulseOnceKF 1.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

/* ---------- Presentational pieces ---------- */
function StaticCoin({ img, label, size = "sm" }) {
  const cls = size === "sm" ? "w-24 h-24 text-2xl" : "w-36 h-36 text-3xl";
  return (
    <div className={`relative ${cls} select-none`}>
      <img
        src={img}
        alt=""
        className="absolute inset-0 w-full h-full object-contain drop-shadow-xl pointer-events-none"
      />
     
    </div>
  );
}

function FlippingCoin({
  isFlipping,
  faceWhenFlipping,
  finalOutcome,
  winImg,
  loseImg,
  size = "md",
}) {
  // which face to show now
  const src = isFlipping
    ? faceWhenFlipping === "win"
      ? winImg
      : loseImg
    : finalOutcome === "win"
    ? winImg
    : finalOutcome === "lose"
    ? loseImg
    : winImg;

  const cls = size === "md" ? "w-36 h-36" : "w-44 h-44";

  return (
    <div
      className={`relative ${cls} [transform-style:preserve-3d] select-none ${
        isFlipping ? "[animation:coin-tilt_0.35s_ease-in-out_infinite]" : ""
      }`}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl pointer-events-none backface-hidden"
      />
    </div>
  );
}
