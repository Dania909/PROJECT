import React from "react";

export function Stat({ label, value, highlight = false }) {
  return (
    <div className="min-w-[110px] text-center">
      <div className="text-[10px] tracking-widest text-white/60">{label}</div>
      <div
        className={`text-xl font-black mt-0.5 ${
          highlight ? "text-yellow-400" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
