import React, { useEffect, useRef, useState } from "react";

// Assets
import CongratsBg from "../assets/CongratulationBackground.png";
import DesignAbove from "../assets/CongratulationDesignAbove.png";
import DesignBelow from "../assets/CongratulationDesignBelow.png";
import EffectImg from "../assets/CongratulationEffect.png";
import StartImg from "../assets/Start.png";

// Reuse from Buy
import BorderImg from "../assets/Border.png";
import TorchImg from "../assets/torch.png";
import FlameImg from "../assets/Flame.png";

export default function CongratsModal({ open, spins = 10, onStart }) {
  if (!open) return null;

  const [startImgFailed, setStartImgFailed] = useState(false);

  // ===== Base design canvas (tablet/desktop layout) =====
  const BASE_W = 750;
  const BASE_H = Math.round(BASE_W * 0.72); // keep your ratio

  const BORDER_SCALE = 0.98;
  const BORDER_Z = -1000;
  const PANEL_Z = 10;
  const CONTENT_Z = 90;
  const TORCH_Z = 80;
  const FLAME_Z = 85;

  // Torches
  const TORCH_W = 60;
  const TORCH_Y = 70;
  const LEFT_TORCH_LEFT = 140;
  const RIGHT_TORCH_RIGHT = 140;

  // Flame
  const FLAME_W = 220;
  const FLAME_BOTTOM = TORCH_W * 1.95;

  // ===== ABSOLUTE POSITIONS =====
  const TITLE_Y  = 25;
  const WON_Y    = 95;
  const VINE_Y   = 147;
  const EFFECT_Y = -9;
  const BELOW_Y  = 254;
  const FREE_Y   = 290;
  const START_Y  = 350;

  // Sizes
  const TITLE_SIZE  = 31;
  const WON_SIZE    = 31;
  const FREE_SIZE   = 28;
  const VINE_W      = 400;
  const BELOW_W     = 400;
  const EFFECT_W    = 500;
  const CTA_W       = 200;
  const NUMBER_SIZE = 100;

  // ===== Start button: one-shot pulse every 3s (reliable restart) =====
  const [animateStart, setAnimateStart] = useState(false);
  const [useAltAnim, setUseAltAnim] = useState(false);

  useEffect(() => {
    if (!open) return;
    const DURATION_MS = 3000;
    const INTERVAL_MS = 3000;
    const tick = () => {
      setUseAltAnim((v) => !v);
      setAnimateStart(true);
      setTimeout(() => setAnimateStart(false), DURATION_MS - 10);
    };
    const kickoff = setTimeout(tick, 800);
    const interval = setInterval(tick, INTERVAL_MS);
    return () => { clearTimeout(kickoff); clearInterval(interval); };
  }, [open]);

  // ===== Responsive scaler (phones) =====
  const shellRef = useRef(null);
  const [scale, setScale] = useState(1);

  const updateScale = () => {
    if (!shellRef.current) return;
    const shellW = shellRef.current.clientWidth || BASE_W;
    // Scale stage to fit shell; clamp so it’s still readable on very small phones
    const s = Math.max(0.5, Math.min(1, shellW / BASE_W));
    setScale(s);
  };

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const shellHeight = Math.round(BASE_H * scale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Shell: responsive width, height follows scaled stage */}
      <div
        ref={shellRef}
        className="relative"
        style={{
          width: "min(92vw, 750px)",
          height: shellHeight,
        }}
      >
        {/* Scaled stage: keeps all your absolute positions intact */}
        <div
          className="relative"
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Border */}
          <img
            src={BorderImg}
            alt="border"
            className="absolute select-none pointer-events-none animate-[borderPulse_1.8s_ease-in-out_infinite]"
            style={{
              zIndex: BORDER_Z,
              width: BASE_W * BORDER_SCALE,
              height: BASE_H * BORDER_SCALE,
              left: "48.7%",
              top: "43.5%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              opacity: 0.96,
            }}
          />

          {/* Background */}
          <img
            src={CongratsBg}
            alt="Congratulations"
            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
            style={{ zIndex: PANEL_Z }}
          />

          {/* Torches */}
          <div
            className="absolute overflow-visible"
            style={{ zIndex: TORCH_Z, left: LEFT_TORCH_LEFT, bottom: TORCH_Y, width: TORCH_W }}
          >
            <img src={TorchImg} alt="torch left" className="w-full select-none pointer-events-none" />
            <img
              src={FlameImg}
              alt="flame left"
              className="absolute left-1/2 select-none pointer-events-none"
              style={{
                zIndex: FLAME_Z,
                width: FLAME_W,
                transform: "translateX(-50%)",
                bottom: FLAME_BOTTOM,
                animation: "flameUp 0.7s ease-in-out infinite",
              }}
            />
          </div>
          <div
            className="absolute overflow-visible"
            style={{ zIndex: TORCH_Z, right: RIGHT_TORCH_RIGHT, bottom: TORCH_Y, width: TORCH_W }}
          >
            <img
              src={TorchImg}
              alt="torch right"
              className="w-full select-none pointer-events-none"
              style={{ transform: "scaleX(-1)" }}
            />
            <img
              src={FlameImg}
              alt="flame right"
              className="absolute left-1/2 select-none pointer-events-none"
              style={{
                zIndex: FLAME_Z,
                width: FLAME_W,
                transform: "translateX(-50%)",
                bottom: FLAME_BOTTOM,
                animation: "flameUp 0.7s ease-in-out infinite",
              }}
            />
          </div>

          {/* Content */}
          <div className="absolute inset-0" style={{ zIndex: CONTENT_Z }}>
            {/* CONGRATS */}
            <div
              className="absolute left-1/2 -translate-x-1/2 font-extrabold tracking-wider text-yellow-300 drop-shadow-[0_3px_0_rgba(0,0,0,.65)]"
              style={{ top: TITLE_Y, fontSize: TITLE_SIZE }}
            >
              CONGRATULATIONS!
            </div>

            {/* YOU HAVE WON */}
            <div
              className="absolute left-1/2 -translate-x-1/2 font-extrabold text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,.6)]"
              style={{ top: WON_Y, fontSize: WON_SIZE }}
            >
              YOU HAVE WON
            </div>

            {/* Vine bar */}
            <img
              src={DesignAbove}
              alt="vine bar"
              className="absolute left-1/2 -translate-x-1/2 select-none pointer-events-none"
              style={{ top: VINE_Y, width: VINE_W }}
            />

            {/* Effect + number */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: EFFECT_Y, width: EFFECT_W }}
            >
              <img
                src={EffectImg}
                alt="effect"
                className="w-full h-auto select-none pointer-events-none"
              />
              <div
                className="absolute inset-0 flex items-center justify-center font-extrabold text-yellow-300 drop-shadow-[0_4px_0_rgba(0,0,0,.6)]"
                style={{ fontSize: NUMBER_SIZE }}
              >
                {spins}
              </div>
            </div>

            {/* Design BELOW */}
            <img
              src={DesignBelow}
              alt="design below"
              className="absolute left-1/2 -translate-x-1/2 select-none pointer-events-none"
              style={{ top: BELOW_Y, width: BELOW_W }}
            />

            {/* FREE SPINS */}
            <div
              className="absolute left-1/2 -translate-x-1/2 font-extrabold text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,.6)] tracking-wide"
              style={{ top: FREE_Y, fontSize: FREE_SIZE }}
            >
              FREE SPINS
            </div>

            {/* START */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: START_Y, width: CTA_W }}
            >
              {!startImgFailed ? (
                <span
                  className="inline-block"
                  style={
                    animateStart
                      ? {
                          animation: `${useAltAnim ? "pulseOnceA" : "pulseOnceB"} 3s ease-in-out`,
                        }
                      : undefined
                  }
                >
                  <img
                    src={StartImg}
                    alt="Start"
                    className="w-full h-auto select-none block"
                    onError={() => setStartImgFailed(true)}
                    onClick={onStart}
                    style={{ cursor: "pointer" }}
                  />
                </span>
              ) : (
                <button
                  onClick={onStart}
                  className="w-full py-3 rounded-[14px] bg-gradient-to-b from-[#71ff79] to-[#27d53c]
                             border-4 border-[#d8a64a] text-[#0a120a] font-extrabold text-xl
                             shadow-[0_6px_0_#7a5b24] hover:brightness-110 active:translate-y-[1px]"
                >
                  START
                </button>
              )}
            </div>
          </div>
        </div>
        {/* /scaled stage */}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes borderPulse {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 208, 64, 0.8)) drop-shadow(0 0 22px rgba(255, 240, 160, 0.6)); opacity: .98; }
          50%      { filter: drop-shadow(0 0 20px rgba(255, 220, 96, 1)) drop-shadow(0 0 34px rgba(255, 255, 200, 0.85)); opacity: 1; }
        }
        @keyframes flameUp {
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); opacity: .95; filter: brightness(1); }
          50%      { transform: translateX(-50%) translateY(-3px) scale(1.08); opacity: 1; filter: brightness(1.08); }
        }
        /* Two identical one-shot pulses — we alternate names to reliably restart */
        @keyframes pulseOnceA {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        @keyframes pulseOnceB {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
