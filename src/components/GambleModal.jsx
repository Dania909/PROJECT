import React, { useEffect, useMemo, useState } from "react";

/* Ladder: start 10 → try for 15/20/30/50.
   Lose fallbacks: 5 / 10 / 10 / 15 (ends on lose). */
const LADDER = [
  { win: 15, lose: 5 },
  { win: 20, lose: 10 },
  { win: 30, lose: 10 },
  { win: 50, lose: 15 },
];

export default function GambleModal({ open, initialSpins = 10, onCollect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSpins, setCurrentSpins] = useState(initialSpins);
  const [ended, setEnded] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastOutcome, setLastOutcome] = useState(null); // 'win' | 'lose' | null

  // Reset internal state each time the modal is opened or initial spins change
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setCurrentSpins(initialSpins);
      setEnded(false);
      setIsFlipping(false);
      setLastOutcome(null);
    }
  }, [open, initialSpins]);

  const canGamble = open && !ended && currentIndex < LADDER.length;
  const step = LADDER[currentIndex];
  const topBanner = useMemo(() => ["15", "20", "30", "50"], []);

  if (!open) return null;

  function doGamble() {
    if (!canGamble || isFlipping) return;
    setIsFlipping(true);

    setTimeout(() => {
      const win = Math.random() < 0.5; // 50/50
      setIsFlipping(false);
      setLastOutcome(win ? "win" : "lose");

      if (win) {
        setCurrentSpins(step.win);
        if (currentIndex < LADDER.length - 1) setCurrentIndex(currentIndex + 1);
        else setEnded(true); // reached top
      } else {
        setCurrentSpins(step.lose);
        setEnded(true);
      }
    }, 820);
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-[min(96vw,900px)] rounded-2xl border-4 border-amber-700
                      bg-gradient-to-b from-[#2f251e] to-[#1e1712] p-4 shadow-2xl">
        {/* Header */}
        <div className="text-center text-2xl font-extrabold text-yellow-300">GAMBLE TO GET:</div>
        <div className="mt-2 flex items-center justify-center gap-3">
          {topBanner.map((v, i) => (
            <div key={v}
              className={`px-3 py-1 rounded-lg border-2
              ${i < currentIndex ? "bg-emerald-500/80 border-emerald-600 text-black" :
                i === currentIndex ? "bg-yellow-400/80 border-yellow-500 text-black" :
                "bg-slate-700/60 border-slate-600 text-slate-200"}`}
            >
              {v}
            </div>
          ))}
        </div>

        {/* Coins */}
        <div className="mt-5 grid grid-cols-3 items-center">
          {/* Lose coin */}
          <div className="flex flex-col items-center">
            <Coin label={step?.lose?.toString()} color="silver" />
            <div className="mt-2 text-sm font-bold text-slate-300">FREE SPINS</div>
          </div>

          {/* Flipping coin */}
          <div className="flex flex-col items-center">
            <div className={`w-40 h-40 rounded-full border-[6px] transform-gpu
                             ${isFlipping ? "animate-[coin-flip_0.8s_ease-in-out_1]" : ""}
                             bg-gradient-to-b from-yellow-300 to-yellow-600 border-yellow-700 flex items-center justify-center`}>
              <div className="text-4xl font-extrabold text-yellow-900 drop-shadow">
                {isFlipping ? "" : (lastOutcome === "win" ? "WIN" : lastOutcome === "lose" ? "LOSE" : "?" )}
              </div>
            </div>
          </div>

          {/* Win coin */}
          <div className="flex flex-col items-center">
            <Coin label={(canGamble ? step.win : currentSpins).toString()} color="gold" />
            <div className="mt-2 text-sm font-bold text-slate-300">FREE SPINS</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => onCollect?.(currentSpins)}
            className="h-12 px-6 rounded-xl bg-red-500 hover:bg-red-400 text-black font-extrabold text-lg
                       border-4 border-amber-700 shadow-[0_4px_0_#7a5b24]"
          >
            COLLECT {currentSpins} FREE SPINS
          </button>

          <button
            disabled={!canGamble}
            onClick={doGamble}
            className={`h-12 px-6 rounded-xl font-extrabold text-lg border-4 border-amber-700 shadow-[0_4px_0_#7a5b24]
              ${canGamble ? "bg-emerald-400 hover:bg-emerald-300 text-black" : "bg-slate-700 text-slate-400 cursor-not-allowed"}`}
          >
            GAMBLE
          </button>
        </div>
      </div>
    </div>
  );
}

function Coin({ label = "", color = "gold" }) {
  const base =
    color === "gold"
      ? "bg-gradient-to-b from-yellow-200 to-yellow-600 border-yellow-700"
      : "bg-gradient-to-b from-slate-200 to-slate-400 border-slate-500";
  return (
    <div className={`w-28 h-28 rounded-full border-[6px] shadow-inner flex items-center justify-center ${base}`}>
      <div className="text-3xl font-extrabold text-black/70 drop-shadow">{label}</div>
    </div>
  );
}
