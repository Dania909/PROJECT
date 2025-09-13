import React, { useState, useEffect, useMemo, useCallback } from "react";
import background from "../assets/background.jpg";
import board from "../assets/back-re.png";
import { Reel } from "./Reel";
import { Stat } from "./Stat";
import {
  randSym,
  generateFreeSpinResult,
  checkFreeSpins,
  calcWin,
  SYMBOLS,
  REELS,
  ROWS,
  CELL_SIZE,
  LINES,
  PAYLINES,
  PAYTABLE,
  STEPS,
} from "../utils";

export default function SlotMachine({ addFreeSpinsSignal, addFreeSpinsAmount }) {
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(5000);
  const [betPerLine, setBetPerLine] = useState(0.01);
  const [lastWin, setLastWin] = useState(0);
  const [result, setResult] = useState(
    Array.from({ length: ROWS }, () =>
      Array.from({ length: REELS }, () => randSym())
    )
  );
  const [reelsStopped, setReelsStopped] = useState(Array(REELS).fill(false));
  const [freeSpins, setFreeSpins] = useState(0);
  const [inFreeSpins, setInFreeSpins] = useState(false);

  const strips = useMemo(
    () =>
      Array.from({ length: REELS }, () =>
        Array.from({ length: 60 }, () => randSym())
      ),
    []
  );

  const startSpin = useCallback(() => {
    if (spinning || (!inFreeSpins && balance < betPerLine * LINES)) return;
    setSpinning(true);
    if (!inFreeSpins) setBalance((prev) => prev - betPerLine * LINES);

    setReelsStopped(Array(REELS).fill(false));

    const nextResult = inFreeSpins
      ? generateFreeSpinResult()
      : Array.from({ length: ROWS }, () =>
          Array.from({ length: REELS }, () => randSym())
        );

    for (let i = 0; i < REELS; i++) {
      setTimeout(() => {
        setReelsStopped((prev) => {
          const updated = [...prev];
          updated[i] = true;
          return updated;
        });
        setResult((prev) =>
          prev.map((row, r) =>
            row.map((cell, c) => (c === i ? nextResult[r][c] : cell))
          )
        );
        if (i === REELS - 1) {
          const win = calcWin(nextResult, betPerLine);
          setLastWin(win);
          if (win > 0) setBalance((prev) => prev + win);
          if (!inFreeSpins) {
            const spinsAwarded = checkFreeSpins(nextResult);
            if (spinsAwarded > 0) {
              setFreeSpins(spinsAwarded);
              setInFreeSpins(true);
            }
          }
          setSpinning(false);
        }
      }, 1000 + i * 400);
    }
  }, [spinning, balance, betPerLine, inFreeSpins]);

  // ⬇️ NEW: when Gamble -> Collect happens, GamePage bumps the signal.
  useEffect(() => {
    if (addFreeSpinsSignal && addFreeSpinsAmount > 0) {
      setFreeSpins((prev) => prev + addFreeSpinsAmount);
      setInFreeSpins(true); // your existing auto-play effect will take it from here
    }
  }, [addFreeSpinsSignal, addFreeSpinsAmount]);

  // auto-play free spins (unchanged)
  useEffect(() => {
    if (inFreeSpins && freeSpins > 0 && !spinning) {
      const timer = setTimeout(() => {
        startSpin();
        setFreeSpins((prev) => prev - 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (inFreeSpins && freeSpins === 0 && !spinning) setInFreeSpins(false);
  }, [inFreeSpins, freeSpins, spinning, startSpin]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        startSpin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startSpin]);

  const increaseBet = () => {
    const currentIndex = STEPS.indexOf(betPerLine);
    if (currentIndex < STEPS.length - 1) setBetPerLine(STEPS[currentIndex + 1]);
  };
  const decreaseBet = () => {
    const currentIndex = STEPS.indexOf(betPerLine);
    if (currentIndex > 0) setBetPerLine(STEPS[currentIndex - 1]);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-16 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-[1500px] max-w-[90%] flex flex-col items-center text-center p-10">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="text-sm opacity-80">
            Press <kbd className="px-2 py-1 rounded bg-white/10">Space</kbd> to spin
          </div>
        </div>

        <div
          className="relative rounded-3xl shadow-2xl p-6 flex flex-col items-center"
          style={{
            backgroundImage: `url(${board})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: 1500,
            height: 1200,
          }}
        >
          <div className="mb-4 text-lg font-bold text-yellow-400">
            Balance: {balance.toFixed(2)}
          </div>

          <div
            className="relative mx-auto grid"
            style={{
              gridTemplateColumns: `repeat(${REELS}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
              gap: 10,
              width: REELS * CELL_SIZE + (REELS - 1) * 10,
              height: ROWS * CELL_SIZE + (ROWS - 1) * 10,
            }}
          >
            <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-yellow-400/30 shadow-inner"></div>
            {Array.from({ length: REELS }, (_, reelIndex) => (
              <Reel
                key={reelIndex}
                spinning={spinning && !reelsStopped[reelIndex]}
                visibleRows={ROWS}
                cellSize={CELL_SIZE}
                strip={strips[reelIndex]}
                resultColumn={result.map((row) => row[reelIndex])}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
              <Stat label="LINES" value={LINES} />
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseBet}
                  className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 text-black font-bold"
                >
                  −
                </button>
                <Stat label="BET / LINE" value={betPerLine.toFixed(2)} />
                <button
                  onClick={increaseBet}
                  className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-400 text-black font-bold"
                >
                  +
                </button>
              </div>
              <Stat label="TOTAL BET" value={(betPerLine * LINES).toFixed(2)} />
              <Stat label="WIN" value={spinning ? "—" : lastWin.toString()} highlight />
              <Stat label="FREE SPINS" value={inFreeSpins ? freeSpins : "—"} highlight />
            </div>

            <button
              onClick={startSpin}
              disabled={spinning || (!inFreeSpins && balance < betPerLine * LINES)}
              className="px-8 py-3 rounded-2xl font-extrabold tracking-wide text-lg disabled:opacity-50 bg-yellow-400 text-black hover:bg-yellow-300 transition"
            >
              {spinning
                ? "SPINNING…"
                : !inFreeSpins && balance < betPerLine * LINES
                ? "NO BALANCE"
                : inFreeSpins
                ? "FREE SPIN"
                : "SPIN"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes reel-spin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
}
