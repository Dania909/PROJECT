import React from "react";

import PanelImg from "../assets/Background.png";        // purple panel
import BorderImg from "../assets/Border.png";           // gold glowing border
import TorchImg from "../assets/torch.png";             // torch base
import FlameImg from "../assets/Flame.png";             // flame
import FieldImg from "../assets/buyfeaturefields.png";  // green input field
import PlusImg from "../assets/plus.png";               // plus button
import CancelImg from "../assets/Cancel.png";           // cancel button
import BuyImg from "../assets/Buy.png";                 // buy button

const BET_OPTIONS = [0.25, 0.5, 1.25, 2.5, 7.5, 12.5, 25, 50, 125, 250];
const BUY_MULT = 31;
const priceOf = (bet) => +(bet * BUY_MULT).toFixed(2);

export default function BuyFeatureModal({ open, bet, setBet, onCancel, onConfirm }) {
  if (!open) return null;

  // --- Layout numbers (tune if needed) ---
  const WIDTH = 770;
  const HEIGHT = WIDTH * 0.72;

  const BORDER_SCALE = 1.15;
  const BORDER_OFF_X = 0;
  const BORDER_OFF_Y = 0;

  const TORCH_W = 70;
  const TORCH_BOTTOM = 20;

  const FLAME_W = 80;
  const FLAME_BOTTOM = TORCH_BOTTOM + 60;

  const idx = Math.max(0, BET_OPTIONS.indexOf(bet));
  const canDec = idx > 0;
  const canInc = idx < BET_OPTIONS.length - 1;
  const dec = () => canDec && setBet(BET_OPTIONS[idx - 1]);
  const inc = () => canInc && setBet(BET_OPTIONS[idx + 1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div
        className="relative"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        {/* PANEL (base) */}
        <img
          src={PanelImg}
          alt="panel"
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none z-10"
        />

        {/* BORDER (on top of panel) */}
        <img
          src={BorderImg}
          alt="border"
          className="absolute select-none pointer-events-none z-[60]"
          style={{
            width: WIDTH * BORDER_SCALE,
            height: HEIGHT * BORDER_SCALE,
            left: `calc(50% + ${BORDER_OFF_X}px)`,
            top: `calc(50% + ${BORDER_OFF_Y}px)`,
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
          }}
        />

        {/* TORCHES */}
        <img
          src={TorchImg}
          alt="torch left"
          className="absolute select-none pointer-events-none z-40"
          style={{
            width: TORCH_W,
            left: -40,
            bottom: TORCH_BOTTOM,
          }}
        />
        <img
          src={TorchImg}
          alt="torch right"
          className="absolute select-none pointer-events-none z-40"
          style={{
            width: TORCH_W,
            right: -40,
            bottom: TORCH_BOTTOM,
            transform: "scaleX(-1)",
          }}
        />

        {/* FLAMES */}
        <img
          src={FlameImg}
          alt="flame left"
          className="absolute select-none pointer-events-none z-50 animate-[flame_0.7s_ease-in-out_infinite]"
          style={{
            width: FLAME_W,
            left: -34,
            bottom: FLAME_BOTTOM,
          }}
        />
        <img
          src={FlameImg}
          alt="flame right"
          className="absolute select-none pointer-events-none z-50 animate-[flame_0.7s_ease-in-out_infinite]"
          style={{
            width: FLAME_W,
            right: -34,
            bottom: FLAME_BOTTOM,
          }}
        />

        {/* CONTENT */}
        <div className="absolute inset-0 grid place-items-center z-30">
          <div className="w-full text-center px-8 pt-16 pb-16">
            {/* Title */}
            <div className="text-[32px] font-extrabold tracking-wider text-yellow-400 drop-shadow-[0_3px_0_rgba(0,0,0,.65)]">
              BUY FEATURE
            </div>
            <div className="mt-2 text-[22px] font-extrabold text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,.6)]">
              TRIGGER 10 FREE SPINS
            </div>

            {/* Bet chooser */}
            <div className="mt-5 text-[18px] font-extrabold text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,.5)]">
              CHOOSE YOUR BET
            </div>
            <div className="mt-3 flex items-center justify-center gap-3">
              {/* Minus */}
              <button
                onClick={dec}
                disabled={!canDec}
                className="w-[60px] h-[56px] grid place-items-center disabled:opacity-40"
              >
                <span className="text-3xl text-yellow-600 font-extrabold">−</span>
              </button>

              {/* Bet field */}
              <div
                className="w-[200px] h-[56px] flex items-center justify-center text-emerald-300 font-extrabold text-[22px]"
                style={{
                  backgroundImage: `url(${FieldImg})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {bet.toFixed(2)}
              </div>

              {/* Plus */}
              <button onClick={inc} disabled={!canInc} className="disabled:opacity-40">
                <img src={PlusImg} alt="+" className="w-[60px] h-[56px] select-none" />
              </button>
            </div>

            {/* Price */}
            <div className="mt-4 text-[18px] font-extrabold text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,.5)]">
              BUY PRICE
            </div>
            <div
              className="mt-2 w-[200px] h-[56px] mx-auto flex items-center justify-center text-emerald-300 font-extrabold text-[22px]"
              style={{
                backgroundImage: `url(${FieldImg})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
            >
              {priceOf(bet).toFixed(2)}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-center gap-10">
              <button onClick={onCancel} className="active:translate-y-[1px]">
                <img src={CancelImg} alt="Cancel" className="w-[190px] h-auto select-none" />
              </button>
              <button onClick={onConfirm} className="active:translate-y-[1px]">
                <img src={BuyImg} alt="Buy" className="w-[190px] h-auto select-none" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flame animation */}
      <style>{`
        @keyframes flame {
          0%, 100% { transform: translateY(0) scale(1); opacity: .95; }
          50%      { transform: translateY(-2px) scale(1.06); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
