import React from "react";
import { Strip } from "./Strip";
import { Cell } from "./Cell";

/**
 * Reel
 * - When `spinning` is true: shows a looping Strip with a soft gradient mask.
 * - When the column contains a symbol with key === "IMAGE1": shows a full-reel overlay using that image.
 * - Otherwise: renders the symbols in a grid of visible rows.
 */
export function Reel({
  spinning = false,
  visibleRows = 3,
  cellSize = 120,
  strip = [],
  resultColumn = [],
}) {
  const reelHeight = visibleRows * cellSize;

  const image1 = resultColumn.find((s) => s?.key === "IMAGE1");
  const hasImage1 = Boolean(image1);

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-black/40 border border-white/10"
      style={{ width: cellSize, height: reelHeight }}
    >
      {spinning ? (
        // 🔹 Spinning animation with gradient mask
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "linear-gradient(transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(transparent, black 20%, black 80%, transparent)",
          }}
        >
          <div className="h-[200%] animate-[reel-spin_0.5s_linear_infinite]">
            <Strip strip={strip} cellSize={cellSize} />
            <Strip strip={strip} cellSize={cellSize} />
          </div>
        </div>
      ) : hasImage1 ? (
        // 🔹 Full wild overlay (IMAGE1 covers whole reel)
        <div
          className="absolute top-0"
          style={{
            width: cellSize + 39, // keep your offset from previous file
            height: reelHeight,
            zIndex: 10,
          }}
        >
          <img
            src={image1.img}
            alt="IMAGE1"
            className="rounded-xl"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      ) : (
        // 🔹 Normal symbols layout
        <div
          className="absolute inset-0 grid"
          // ✅ FIX: gridTemplateRows must be a string
          style={{ gridTemplateRows: `repeat(${visibleRows}, ${cellSize}px)` }}
        >
          {resultColumn.map((sym, i) => (
            <Cell key={i} sym={sym} size={cellSize} />
          ))}
        </div>
      )}

      {/* Local keyframes in case Tailwind doesn't have 'reel-spin' */}
      <style>{`
        @keyframes reel-spin {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}
