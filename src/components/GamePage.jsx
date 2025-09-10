// src/components/GamePage.jsx
import React, { useState } from "react";
import SlotMachine from "./SlotMachine";
import BuyFeatureModal from "./BuyFeatureModal";
import CongratsModal from "./CongratsModal";
import GambleModal from "./GambleModal";

export default function GamePage() {
  const [bet, setBet] = useState(0.25);

  // modals
  const [showBuy, setShowBuy] = useState(false);        // start closed
  const [showCongrats, setShowCongrats] = useState(false);
  const [showGamble, setShowGamble] = useState(false);

  // you can store how many free spins were bought
  const [freeSpins, setFreeSpins] = useState(10);

  const openBuy = () => setShowBuy(true);

  const handleCancelBuy = () => setShowBuy(false);

  const handleConfirmBuy = () => {
    // here you would subtract the price from balance.
    setShowBuy(false);
    setShowCongrats(true);     // → show the congratulations screen
  };

  const handleCongratsStart = () => {
    setShowCongrats(false);
    setShowGamble(true);       // → then show the gamble screen
  };

  const handleGambleCollect = () => {
    setShowGamble(false);
    // Next step would be: go to game and auto-play free spins.
    // For now we just close the flow.
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <div className="h-12 flex items-center justify-between px-4 text-sm text-white/80 bg-slate-950/60 border-b border-white/10">
        <div>Balance: 5,000.00</div>
        <div>Bet: {bet.toFixed(2)}</div>
      </div>

      <div className="flex-1 grid place-items-center">
        <SlotMachine />
      </div>

      <div className="h-16 flex items-center justify-center gap-4 bg-slate-950/60 border-t border-white/10">
        <button
          onClick={openBuy}
          className="px-6 py-2 rounded-xl font-extrabold text-black
                     bg-emerald-400 hover:bg-emerald-300
                     border-4 border-amber-600 shadow-[0_4px_0_#6c4700]"
        >
          BUY FEATURE
        </button>
      </div>

      {/* BUY */}
      <BuyFeatureModal
        open={showBuy}
        bet={bet}
        setBet={setBet}
        onCancel={handleCancelBuy}
        onConfirm={handleConfirmBuy}
      />

      {/* CONGRATS */}
      <CongratsModal
        open={showCongrats}
        spins={freeSpins}
        onStart={handleCongratsStart}
      />

      {/* GAMBLE */}
      <GambleModal
        open={showGamble}
        spins={freeSpins}
        onCollect={handleGambleCollect}
        // onGamble={() => ... } // wire this later
      />
    </div>
  );
}
