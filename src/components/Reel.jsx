import React from "react";
import { Strip } from "./Strip";
import { Cell } from "./Cell";

export function Reel({ spinning, visibleRows, cellSize, strip, resultColumn }) {
  const hasImage1 = resultColumn.some((sym) => sym.key === "IMAGE1");
  const image1 = resultColumn.find((s) => s.key === "IMAGE1");
  const reelHeight = visibleRows * cellSize;

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-black/40 border border-white/10"
      style={{ width: cellSize, height: reelHeight }}
    >
      {spinning ? (
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
      ) : hasImage1 && image1 ? (
        <div
          className="absolute top-0"
          style={{
            width: cellSize + 35,
            height: visibleRows * cellSize,
            zIndex: 10,
          }}
        >
          <img
            src={image1.img}
            alt="IMAGE1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="rounded-xl"
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateRows: `repeat(${visibleRows}, ${cellSize}px)` }}
        >
          {resultColumn.map((sym, i) => (
            <Cell key={i} sym={sym} size={cellSize} />
          ))}
        </div>
      )}
    </div>
  );
}
