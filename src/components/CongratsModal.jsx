import React from "react";

export default function CongratsModal({ open, spins = 10, onStart }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-[min(92vw,700px)] rounded-2xl border-4 border-amber-700
                      bg-gradient-to-b from-[#2e3b55] to-[#1c2a3f] p-6 shadow-2xl text-center">
        <div className="text-3xl md:text-4xl font-extrabold text-yellow-300 tracking-wide">
          CONGRATULATIONS!
        </div>
        <div className="mt-2 text-2xl font-extrabold text-yellow-200">YOU HAVE WON</div>

        <div className="mt-4 text-[68px] leading-none font-extrabold text-amber-100 drop-shadow">
          {spins}
        </div>
        <div className="text-2xl font-extrabold text-yellow-200 -mt-1">FREE SPINS</div>

        <button
          onClick={onStart}
          className="mt-6 px-10 py-3 rounded-[14px] bg-gradient-to-b from-[#71ff79] to-[#27d53c]
                     border-4 border-[#d8a64a] text-[#0a120a] font-extrabold text-xl shadow-[0_6px_0_#7a5b24]
                     hover:brightness-110 active:translate-y-[1px]"
        >
          START
        </button>
      </div>
    </div>
  );
}
