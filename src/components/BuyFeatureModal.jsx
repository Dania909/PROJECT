import React, { useEffect, useState } from "react";

import PanelImg from "../assets/Background.png";        // purple panel
import BorderImg from "../assets/Border.png";           // gold glowing border
import TorchImg from "../assets/torch.png";             // torch base
import FlameImg from "../assets/Flame.png";             // flame
import FieldImg from "../assets/buyfeaturefields.png";  // green input field
import PlusImg from "../assets/plus.png";               // plus button
import MinusImg from "../assets/minus.png";             // minus button
import CancelImg from "../assets/Cancel.png";
import BuyImg from "../assets/Buy.png";

const BET_OPTIONS = [0.25, 0.5, 1.25, 2.5, 7.5, 12.5, 25, 50, 125, 250];
const BUY_MULT = 31;
const priceOf = (bet) => +(bet * BUY_MULT).toFixed(2);

export default function BuyFeatureModal({ open, bet, setBet, onCancel, onConfirm }) {
  if (!open) return null;

  // ---- Layout (your current baseline) ----
  const WIDTH = 740;
  const HEIGHT = Math.round(WIDTH * 0.72);

  const BORDER_SCALE = 1.0;
  const BORDER_Z = -1000;
  const PANEL_Z = 0;
  const CONTENT_Z = 0;
  const TORCH_Z = 30;
  const FLAME_Z = 40;

  const TORCH_W = 60;
  const TORCH_Y = 40;

  // Right torch correct; left torch moved more to the right
  const LEFT_TORCH_LEFT = 146;
  const RIGHT_TORCH_RIGHT = 110;

  // FLAMES: bigger + vertical (up/down) animation only
  const FLAME_W = 220;                  // bigger
  const FLAME_BOTTOM = TORCH_W * 1.95;  // keep centered above bowl with new size

  // Buttons
  const BTN_W = 168;
  const BTN_GAP = 55;

  // Title placement (moved a little down)
  const TITLE_TOP_PX = 18; // ⬅️ was 12

  const idx = Math.max(0, BET_OPTIONS.indexOf(bet));
  const canDec = idx > 0;
  const canInc = idx < BET_OPTIONS.length - 1;
  const dec = () => canDec && setBet(BET_OPTIONS[idx - 1]);
  const inc = () => canInc && setBet(BET_OPTIONS[idx + 1]);

  // ========= Pulsed (not continuous) animation for Cancel/Buy =========
  const [animateAction, setAnimateAction] = useState(false);
  useEffect(() => {
    const PULSE_MS = 1200;     // how long one pulse runs
    const INTERVAL_MS = 3500;  // how often to trigger (3–4s feel)
    const tick = () => {
      setAnimateAction(true);
      setTimeout(() => setAnimateAction(false), PULSE_MS);
    };
    // fire once after a short delay so first pulse isn't immediate
    const kickoff = setTimeout(tick, 800);
    const interval = setInterval(tick, INTERVAL_MS);
    return () => { clearTimeout(kickoff); clearInterval(interval); };
  }, []);
  // ====================================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative" style={{ width: WIDTH, height: HEIGHT }}>
        {/* BORDER (behind, with glow pulse) */}
        <img
          src={BorderImg}
          alt="border"
          className="absolute select-none pointer-events-none animate-[borderPulse_1.8s_ease-in-out_infinite]"
          style={{
            zIndex: BORDER_Z,
            width: WIDTH * BORDER_SCALE,
            height: HEIGHT * BORDER_SCALE,
            left: "51%",
            top: "45%",
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
            opacity: 0.96,
          }}
        />

        {/* PANEL (base) */}
        <img
          src={PanelImg}
          alt="panel"
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{ zIndex: PANEL_Z }}
        />

        {/* TORCHES */}
        {/* LEFT torch — moved more to the right */}
        <div
          className="absolute"
          style={{
            zIndex: TORCH_Z,
            left: LEFT_TORCH_LEFT,
            bottom: TORCH_Y,
            width: TORCH_W,
          }}
        >
          <img src={TorchImg} alt="torch left" className="w-full select-none pointer-events-none" />
          <img
            src={FlameImg}
            alt="flame left"
            className="absolute left-1/2 select-none pointer-events-none"
            style={{
              zIndex: FLAME_Z,
              width: FLAME_W,                     // bigger
              transform: "translateX(-50%)",
              bottom: FLAME_BOTTOM,               // lifted to match size
              animation: "flameUp 0.7s ease-in-out infinite",
            }}
          />
        </div>

        {/* RIGHT torch — unchanged position */}
        <div
          className="absolute"
          style={{
            zIndex: TORCH_Z,
            right: RIGHT_TORCH_RIGHT,
            bottom: TORCH_Y,
            width: TORCH_W,
          }}
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
              width: FLAME_W,                     // bigger
              transform: "translateX(-50%)",
              bottom: FLAME_BOTTOM,               // lifted to match size
              animation: "flameUp 0.7s ease-in-out infinite",
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="absolute inset-0 grid place-items-center" style={{ zIndex: CONTENT_Z }}>
          {/* Wrapper relative so title can float */}
          <div className="relative w-full text-center px-10 pb-15" style={{ paddingTop: "33px" }}>
            {/* ONLY the "BUY FEATURE" above others */}
            <div
              className="absolute -translate-x-1/2 z-[70]"
              style={{
                top: TITLE_TOP_PX,
                left: "calc(50% + 8px)",
              }}
            >
              <div className="text-[36px] font-extrabold tracking-wider text-yellow-400 drop-shadow-[0_3px_0_rgba(0,0,0,.65)]">
                BUY FEATURE
              </div>
            </div>

            {/* Everything else */}
            <div className="pt-8 relative -right-3">
              <div className="text-[22px] font-extrabold text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,.6)]">
                <div className="pt-10 relative ">
                  TRIGGER 10 FREE SPINS
                </div>
              </div>

              {/* Bet chooser */}
              <div className="mt-5 text-[18px] font-extrabold text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,.5)]">
                CHOOSE YOUR BET
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  onClick={dec}
                  disabled={!canDec}
                  className="disabled:opacity-40 active:translate-y-[1px]"
                  style={{ width: 52, height: 50 }}
                  aria-label="Decrease bet"
                >
                  <img src={MinusImg} alt="-" className="w-full h-full object-contain select-none" />
                </button>

                {/* Value field — text changed to white */}
                <div
                  className="flex items-center justify-center text-white font-extrabold text-[22px]"
                  style={{
                    width: 220,
                    height: 58,
                    backgroundImage: `url(${FieldImg})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    textShadow: "0 2px 0 rgba(0,0,0,.6)",
                  }}
                >
                  {bet.toFixed(2)}
                </div>

                <button
                  onClick={inc}
                  disabled={!canInc}
                  className="disabled:opacity-40 active:translate-y-[1px]"
                  style={{ width: 52, height: 50 }}
                  aria-label="Increase bet"
                >
                  <img src={PlusImg} alt="+" className="w-full h-full object-contain select-none" />
                </button>
              </div>

              {/* Price */}
              <div className="mt-4 text-[18px] font-extrabold text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,.5)]">
                BUY PRICE
              </div>
              {/* Balance/price field — text changed to white */}
              <div
                className="mt-2 mx-auto flex items-center justify-center text-white font-extrabold text-[22px]"
                style={{
                    width: 220,
                    height: 58,
                    backgroundImage: `url(${FieldImg})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    textShadow: "0 2px 0 rgba(0,0,0,.6)",
                }}
              >
                {priceOf(bet).toFixed(2)}
              </div>

              {/* Buttons row */}
              <div className="mt-8 flex items-center justify-center" style={{ gap: BTN_GAP }}>
                {/* Cancel */}
                <button
                  onClick={onCancel}
                  className="relative active:translate-y-[1px]"
                  style={{ width: BTN_W, position: "relative", left: 9 }}
                >
                  <span className={animateAction ? "inline-block animate-pulseOnce" : "inline-block"}>
                    <img
                      src={CancelImg}
                      alt="Cancel"
                      className="w-full h-auto select-none"
                    />
                  </span>
                </button>

                {/* Buy */}
                <button
                  onClick={onConfirm}
                  className="relative active:translate-y-[1px]"
                  style={{ width: BTN_W, position: "relative", left: 5 }}
                >
                  <span className={animateAction ? "inline-block animate-pulseOnce" : "inline-block"}>
                    <img
                      src={BuyImg}
                      alt="Buy"
                      className="w-full h-auto select-none"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes borderPulse {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 208, 64, 0.8)) drop-shadow(0 0 22px rgba(255, 240, 160, 0.6)); opacity: .98; }
          50%      { filter: drop-shadow(0 0 20px rgba(255, 220, 96, 1)) drop-shadow(0 0 34px rgba(255, 255, 200, 0.85)); opacity: 1; }
        }
        /* Vertical flame flicker (no sideways motion) */
        @keyframes flameUp {
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); filter: brightness(1); opacity: .95; }
          50%      { transform: translateX(-50%) translateY(-3px) scale(1.08); filter: brightness(1.08); opacity: 1; }
        }
        /* One-shot pulse (subtle, short) */
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
