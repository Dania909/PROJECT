import React from "react";

export function Cell({ sym, size, faded = false }) {
  return (
    <div
      className={`flex items-center justify-center text-4xl md:text-5xl font-black select-none ${
        faded ? "opacity-80" : ""
      }`}
      style={{ width: size, height: size }}
    >
      {sym.key === "IMAGE2" ? (
        <img
          src={sym.img}
          alt="IMAGE2"
          className="w-full h-full rounded-xl border border-yellow-400/50 shadow-lg"
          style={{ height: size - 4 }}
        />
      ) : (
        <div className="w-[72px] h-[74px] rounded-xl bg-neutral-800/80 border border-white/10 shadow-inner flex items-center justify-center">
          {sym.emoji ? (
            <span className="drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
              {sym.emoji}
            </span>
          ) : (
            <img
              src={sym.img}
              alt={sym.key}
              className="w-[60px] h-[60px] object-contain drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]"
            />
          )}
        </div>
      )}
    </div>
  );
}
