// src/components/GamePage.jsx
import React, { useState } from "react";
import SlotMachine from "./SlotMachine";
import BuyFeatureModal from "./BuyFeatureModal";
import CongratsModal from "./CongratsModal";
import GambleModal from "./GambleModal";

const BUY_MULT = 31;
const priceOf = (bet) => +(bet * BUY_MULT).toFixed(2);

export default function GamePage() {
  const [bet, setBet] = useState(0.25);

  // shared balance (used by SlotMachine + Buy flow)
  const [balance, setBalance] = useState(5000);

  // modals
  const [showBuy, setShowBuy] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showGamble, setShowGamble] = useState(false);

  // default free spins displayed in Congrats/Gamble
  const [freeSpins] = useState(10);

  // signal to SlotMachine to add free spins
  const [fsSignal, setFsSignal] = useState(0);
  const [fsAmount, setFsAmount] = useState(0);

  const openBuy = () => setShowBuy(true);
  const handleCancelBuy = () => setShowBuy(false);

  const handleConfirmBuy = () => {
    const cost = priceOf(bet);
    if (balance < cost) {
      alert("Not enough balance");
      return; // keep Buy modal open
    }
    setBalance((b) => +(b - cost).toFixed(2)); // deduct cost
    setShowBuy(false);       // close Buy
    setShowCongrats(true);   // open your existing Congrats modal
  };

  const handleCongratsStart = () => {
    setShowCongrats(false);
    setShowGamble(true);
  };

  const handleGambleCollect = (collectedSpins) => {
    setShowGamble(false);
    setFsAmount(collectedSpins);
    setFsSignal((s) => s + 1); // tell SlotMachine to add spins
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <div className="h-12 flex items-center justify-between px-4 text-sm text-white/80 bg-slate-950/60 border-b border-white/10">
        <div>Balance: {balance.toFixed(2)}</div>
        <div>Bet: {bet.toFixed(2)}</div>
      </div>

      <div className="flex-1 grid place-items-center">
        <SlotMachine
          onOpenBuy={openBuy}
          addFreeSpinsSignal={fsSignal}
          addFreeSpinsAmount={fsAmount}
          // 🔗 share balance with SlotMachine so spins/wins update the same number
          balance={balance}
          setBalance={setBalance}
        />
      </div>

      <BuyFeatureModal
        open={showBuy}
        bet={bet}
        setBet={setBet}
        onCancel={handleCancelBuy}
        onConfirm={handleConfirmBuy}
      />

      <CongratsModal open={showCongrats} spins={freeSpins} onStart={handleCongratsStart} />

      <GambleModal open={showGamble} initialSpins={freeSpins} onCollect={handleGambleCollect} />
    </div>
  );
}
