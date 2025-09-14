import React from "react";
import { Strip } from "./Strip";
import { Cell } from "./Cell";

export function Reel({
  spinning = false,
  visibleRows = 3,
  cellSize = 100,
  strip = [],
  resultColumn = [],
  // when true we play the fire+zoom only on WILD reels
  wildWin = false,
  wildFxKey = 0,
}) {
  // 🔧 spacing between symbols (px)
  const ROW_GAP_PX = 20;

  // Make the wrapper tall enough to include the gaps so the last row doesn't get clipped.
  const wrapperHeight =
    visibleRows * cellSize + (visibleRows - 1) * ROW_GAP_PX;

  // if this column has IMAGE1 anywhere, your original code shows the tall WILD art
  const image1 = resultColumn.find((s) => s?.key === "IMAGE1");
  const hasImage1 = Boolean(image1);

  return (
    <div
      className="relative overflow-hidden rounded-xl border-white/10 w-full"
      style={{ height: wrapperHeight }}
    >
      {spinning ? (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="h-[200%]"
            style={{ animation: "reel-spin 0.5s linear infinite" }}
          >
            <Strip strip={strip} cellSize={cellSize} />
            <Strip strip={strip} cellSize={cellSize} />
          </div>
        </div>
      ) : hasImage1 ? (
        // TALL WILD art + (only when wildWin) quick zoom and fire lines
        <div className="absolute inset-0" key={`wild-reel-${wildFxKey}`}>
          {/* the original WILD image (no replacement) */}
          <img
            src={image1.img}
            alt="IMAGE1"
            className="rounded-xl w-full h-full"
            style={{
              objectFit: "cover",
              animation: wildWin ? "wild-punch 260ms ease-out both" : "none",
            }}
          />

          {/* fire border around the whole WILD panel (subtle pulse) */}
          {wildWin && (
            <div
              className="pointer-events-none absolute inset-[4%] rounded-xl"
              style={{
                border: "3px solid rgba(255,230,140,.95)",
                boxShadow:
                  "0 0 12px rgba(255,200,100,.85), 0 0 28px rgba(255,150,40,.6), inset 0 0 16px rgba(255,170,50,.5)",
                animation: "wild-border-pulse 900ms ease-in-out 2",
                mixBlendMode: "screen",
              }}
            />
          )}

          {/* two “fire sticks” per row area, ONLY when wildWin */}
          {wildWin && (
            <div
              className="pointer-events-none absolute inset-0 grid"
              style={{ gridTemplateRows: `repeat(${visibleRows}, 1fr)` }}
            >
              {Array.from({ length: visibleRows }).map((_, r) => {
                const base = r * 70; // tiny stagger per row (ms)
                return (
                  <div key={`w-row-${wildFxKey}-${r}`} className="relative">
                    {/* stick #1 */}
                    <span
                      style={{
                        position: "absolute",
                        left: "-10%",
                        top: "38%",
                        width: "120%",
                        height: "12%",
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,.95) 45%, #ffd771 52%, rgba(255,255,255,.95) 58%, rgba(0,0,0,0) 100%)",
                        filter: "blur(1px)",
                        mixBlendMode: "screen",
                        opacity: 0,
                        animation: `stick-in 100ms linear ${base}ms forwards, 
                                    stick-sweep 1000ms ease-in-out ${base}ms 2 alternate, 
                                    stick-flicker 320ms ease-in-out ${base + 100}ms 6 alternate`,
                      }}
                    />
                    {/* stick #2 */}
                    <span
                      style={{
                        position: "absolute",
                        left: "-12%",
                        top: "66%",
                        width: "124%",
                        height: "12%",
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,.95) 45%, #ffd771 52%, rgba(255,255,255,.95) 58%, rgba(0,0,0,0) 100%)",
                        filter: "blur(1px)",
                        mixBlendMode: "screen",
                        opacity: 0,
                        animation: `stick-in 100ms linear ${base + 120}ms forwards, 
                                    stick-sweep 1040ms ease-in-out ${base + 120}ms 2 alternate, 
                                    stick-flicker 320ms ease-in-out ${base + 220}ms 6 alternate`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // regular 4 cells
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateRows: `repeat(${visibleRows}, 1fr)`,
            rowGap: ROW_GAP_PX, // ← more space between rows
          }}
        >
          {resultColumn.map((sym, i) => (
            <Cell key={i} sym={sym} size={cellSize} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes reel-spin {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        /* quick zoom-in then settle to normal */
        @keyframes wild-punch {
          0%   { transform: scale(1.08); filter: brightness(1.15); }
          100% { transform: scale(1.00); filter: brightness(1.00); }
        }
        @keyframes wild-border-pulse {
          0% { box-shadow: 0 0 10px rgba(255,200,90,.7), 0 0 22px rgba(255,140,0,.45), inset 0 0 12px rgba(255,170,50,.45); }
          50%{ box-shadow: 0 0 16px rgba(255,220,120,.95), 0 0 34px rgba(255,160,30,.65), inset 0 0 20px rgba(255,190,70,.6); }
          100%{ box-shadow: 0 0 10px rgba(255,200,90,.7), 0 0 22px rgba(255,140,0,.45), inset 0 0 12px rgba(255,170,50,.45); }
        }
        @keyframes stick-in      { from { opacity: 0; } to { opacity: .95; } }
        @keyframes stick-sweep   { 0% { transform: translateX(-6%); } 100% { transform: translateX(6%); } }
        @keyframes stick-flicker { 0% { filter: blur(1px) brightness(1.0);} 50%{ filter: blur(1.1px) brightness(1.25);} 100%{ filter: blur(1px) brightness(1.0);} }
      `}</style>
    </div>
  );
}
