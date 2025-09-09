import React from "react";
import coverImg from "../assets/cover.jpg";   // background image (the main cover)


export default function Cover({ onStart }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#08130f] overflow-hidden">

 
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${coverImg})` }}
      />

      {/* Semi-transparent dark overlay to make text more readable */}
      <div className="absolute inset-0 bg-black/28" />

      {/* Foreground content (title, win text, banner, start button) */}
      <div className="relative z-10 w-full max-w-[980px] mx-auto px-4 text-center">

 



        {/* START button (green) */}
        <button
          onClick={onStart}  // when clicked → calls onStart (switches to game screen)
          className="mt-5 inline-block px-10 py-3 rounded-xl font-extrabold text-lg
                     bg-green-500 text-black hover:bg-green-400
                     shadow-[0_0_20px_rgba(0,0,0,.7)] transition"
        >
          START
        </button>

      </div>
    </div>
  );
}
