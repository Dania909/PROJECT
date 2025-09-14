import React, { useState, useEffect, useMemo, useCallback } from "react";
import background from "../assets/background.jpg";
import slotcon from "../assets/slotcon.png";
import bluee from "../assets/bluee.png";
import minus from "../assets/minuss.png";
import plus from "../assets/pluss.png";

import SparkleBackground from "./SparkleBackground.jsx";
import spinImg from "../assets/divsp.png";
import loadingImg from "../assets/stop.png";
import another from "../assets/spinns.png";

import resul from "../assets/boar.png";
import { Reel } from "./Reel";
import { Stat } from "./Stat";
import mage from "../assets/lines.png";
import AutoPlayButton from "./AutoPlayButton";
import freeSpinsImage from "../assets/freespins.jpg";

// Win FX assets
import fxAbove from "../assets/CongratulationDesignAbove.png";
import fxBelow from "../assets/CongratulationDesignBelow.png";
import fxBlue from "../assets/CongratulationEffect.png";

// Torches
import TorchImg from "../assets/torch.png";
import FlameImg from "../assets/Flame.png";

// Buy image
import buyImg from "../assets/buy1.png";

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
} from "../utils.jsx";

// ===== Coin SVG for shower =====
const CoinSVG = ({ size = 44 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ filter: "drop-shadow(0 0 8px rgba(255,180,0,.85))" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="coinCore" cx="35%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#fff6c9" />
        <stop offset="40%" stopColor="#ffd45e" />
        <stop offset="85%" stopColor="#f3a81e" />
        <stop offset="100%" stopColor="#c67f00" />
      </radialGradient>
      <linearGradient id="coinRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffe18a" />
        <stop offset="60%" stopColor="#ffb100" />
        <stop offset="100%" stopColor="#c67f00" />
      </linearGradient>
      <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
        <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#coinRim)" />
    <circle cx="50" cy="50" r="42" fill="url(#coinCore)" />
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="none"
      stroke="#ffe7a3"
      strokeWidth="4"
      opacity="0.9"
    />
    <rect
      x="5"
      y="20"
      width="60"
      height="14"
      fill="url(#shine)"
      transform="rotate(-25 35 27)"
      opacity="0.9"
    />
  </svg>
);

const WIN_ANCHOR_LEFT = "47%";

const CENTER_BLOCK_LEFT = "26%";
const LEFT_BLOCK_LEFT = "3%";
const CENTER_BLOCK_BOTTOM = "1.8rem";

// Bigger WIN field
const WIN_WIDTH = "19.5rem";
const WIN_HEIGHT = "2.2rem";
const WIN_FONT_SIZE = "1rem";

export default function SlotMachine({
  addFreeSpinsSignal,
  addFreeSpinsAmount,
  onOpenBuy = () => {},
  balance: externalBalance,
  setBalance: externalSetBalance,
}) {
  const [spinning, setSpinning] = useState(false);

  const [internalBalance, setInternalBalance] = useState(5000);
  const balance = externalBalance ?? internalBalance;
  const setBalance = externalSetBalance ?? setInternalBalance;

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

  // ===== Win FX state =====
  const [showWinFX, setShowWinFX] = useState(false);
  const [winFxCoins, setWinFxCoins] = useState([]);
  const [winFxKey, setWinFxKey] = useState(0);

  // Fire-box on wild columns
  const [showWildBox, setShowWildBox] = useState(false);
  const [wildBoxKey, setWildBoxKey] = useState(0);

  // Big Win overlay
  const [showBigWin, setShowBigWin] = useState(false);
  const [bigWinKey, setBigWinKey] = useState(0);
  const [bigWinCoins, setBigWinCoins] = useState([]);
  const [freeSpinAnimKey, setFreeSpinAnimKey] = useState(0);

  // Strip data
  const strips = useMemo(
    () =>
      Array.from({ length: REELS }, () =>
        Array.from({ length: 60 }, () => randSym())
      ),
    []
  );

  const BIG_WIN_SHOW_MS = 1400;

  const triggerWinFX = useCallback((amount) => {
    if (amount <= 1) return;

    const N = 90;
    const coins = Array.from({ length: N }, () => ({
      leftVW: Math.random() * 100,
      delayS: +(Math.random() * 0.6).toFixed(2),
      driftPX: Math.round((Math.random() - 0.5) * 480),
      fallVH: 140 + Math.round(Math.random() * 60),
      size: Math.round(40 + Math.random() * 30),
      spinDurS: +(0.9 + Math.random() * 0.6).toFixed(2),
      fallDurS: +(2.6 + Math.random() * 0.8).toFixed(2),
    }));

    const maxEndS = coins.reduce(
      (m, c) => Math.max(m, c.delayS + c.fallDurS),
      0
    );
    const totalMs = Math.round(maxEndS * 1000);

    setWinFxCoins(coins);
    setShowWinFX(true);
    setWinFxKey((k) => k + 1);

    setTimeout(() => setShowWinFX(false), totalMs + 60);
  }, []);

  const triggerBigWin = useCallback(
    (amount) => {
      const N = 140;
      const coins = Array.from({ length: N }, () => ({
        leftVW: Math.random() * 100,
        delayS: +(Math.random() * 0.7).toFixed(2),
        driftPX: Math.round((Math.random() - 0.5) * 540),
        fallVH: 150 + Math.round(Math.random() * 70),
        size: Math.round(46 + Math.random() * 36),
        spinDurS: +(0.8 + Math.random() * 0.8).toFixed(2),
        fallDurS: +(2.8 + Math.random() * 1.0).toFixed(2),
      }));

      setBigWinCoins(coins);
      setBigWinKey((k) => k + 1);
      setShowBigWin(true);

      setTimeout(() => setShowBigWin(false), BIG_WIN_SHOW_MS);
    },
    [BIG_WIN_SHOW_MS]
  );

  const startSpin = useCallback(() => {
    if (spinning || (!inFreeSpins && balance < betPerLine * LINES)) return;

    setSpinning(true);
    if (!inFreeSpins) setBalance((prev) => prev - betPerLine * LINES);

    setReelsStopped(Array(REELS).fill(false));

    const nextResult = inFreeSpins
      ? generateFreeSpinResult()
      : Array.from({ length: ROWS }, () =>
          Array.from({ length: REELS }, () => {
            const rand = Math.random();
            if (rand < 0.000001) return { key: "IMAGE2", img: freeSpinsImage };
            return randSym();
          })
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

          if (win > 0) {
            setBalance((prev) => prev + win);
            setWildBoxKey((k) => k + 1);
            setShowWildBox(true);
            setTimeout(() => setShowWildBox(false), 1000);
          }

          if (win >= 3) {
            triggerBigWin(win);
          } else if (win > 1) {
            triggerWinFX(win);
          }

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
  }, [
    spinning,
    balance,
    betPerLine,
    inFreeSpins,
    setBalance,
    triggerBigWin,
    triggerWinFX,
  ]);
  useEffect(() => {
    if (inFreeSpins) {
      setFreeSpinAnimKey((prev) => prev + 1);
    }
  }, [inFreeSpins]);
  useEffect(() => {
    if (addFreeSpinsSignal && addFreeSpinsAmount > 0) {
      setFreeSpins((prev) => prev + addFreeSpinsAmount);
      setInFreeSpins(true);
    }
  }, [addFreeSpinsSignal, addFreeSpinsAmount]);

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
    let currentIndex = STEPS.indexOf(betPerLine);
    if (currentIndex === -1) {
      currentIndex = STEPS.findIndex((s) => s > betPerLine) - 1;
      if (currentIndex < 0) currentIndex = 0;
    }
    if (currentIndex < STEPS.length - 1) {
      setBetPerLine(STEPS[currentIndex + 1]);
    }
  };

  const decreaseBet = () => {
    let currentIndex = STEPS.indexOf(betPerLine);
    if (currentIndex === -1) {
      currentIndex = STEPS.findIndex((s) => s > betPerLine) - 1;
      if (currentIndex < 0) currentIndex = 0;
    }
    if (currentIndex > 0) {
      setBetPerLine(STEPS[currentIndex - 1]);
    }
  };

  const wildCols = useMemo(() => {
    const cols = Array(REELS).fill(false);
    for (let c = 0; c < REELS; c++) {
      for (let r = 0; r < ROWS; r++) {
        if (result[r][c]?.key === "IMAGE1") {
          cols[c] = true;
          break;
        }
      }
    }
    return cols;
  }, [result]);

  const TORCH_Z = 15;
  const FLAME_Z = 16;
  const TORCH_W = 64;
  const TORCH_Y = 60;
  const LEFT_TORCH_LEFT = 230;
  const RIGHT_TORCH_RIGHT = 230;
  const FLAME_W = 220;
  const FLAME_BOTTOM = TORCH_W * 1.95;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundAttachment: "fixed",
        backgroundSize: "128%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* الخلفية المتلألئة */}
      <SparkleBackground />
      <div style={{ transformOrigin: "center center" }}>
        <div
          className="relative rounded-xl shadow-xl pt-15"
          style={{
            backgroundImage: `url(${slotcon})`,
            backgroundSize: "78% 94.7%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "101vh",
            maxWidth: "2550px",
            bottom: "0.5cm",
          }}
        >
          {/* Top overlay */}
          <img
            src={mage}
            alt="top overlay"
            className="absolute"
            style={{
              top: 21.1,
              left: "77.4%",
              transform: "translateX(-50%)",
              width: "3%",
              height: "7%",
              zIndex: 10,
            }}
          />

          {/* Blue overlay */}
          <img
            src={bluee}
            alt="overlay"
            className="absolute"
            style={{
              width: "60%",
              height: "77%",
              top: "1.5cm",
              right: "20%",
              zIndex: 10,
            }}
          />

          {/* Torches */}
          <div
            className="absolute"
            style={{
              zIndex: TORCH_Z,
              left: LEFT_TORCH_LEFT,
              bottom: TORCH_Y,
              width: TORCH_W,
            }}
          >
            <img
              src={TorchImg}
              alt="torch left"
              className="w-full select-none pointer-events-none"
            />
            <img
              src={FlameImg}
              alt="flame left"
              className="absolute left-1/2 select-none pointer-events-none"
              style={{
                zIndex: FLAME_Z,
                width: FLAME_W,
                transform: "translateX(-50%)",
                bottom: FLAME_BOTTOM,
                animation: "flameUp 0.7s ease-in-out infinite",
              }}
            />
          </div>

          <div
            className="absolute"
            style={{
              zIndex: TORCH_Z,
              right: RIGHT_TORCH_RIGHT,
              bottom: TORCH_Y,
              width: TORCH_W,
            }}
          >
            <img
              src={TorchImg}
              alt="torch right"
              className="w-full select-none pointer-events-none"
              style={{ transform: "scaleX(-1)" }}
            />
            <img
              src={FlameImg}
              alt="flame right"
              className="absolute left-1/2 select-none pointer-events-none"
              style={{
                zIndex: FLAME_Z,
                width: FLAME_W,
                transform: "translateX(-50%)",
                bottom: FLAME_BOTTOM,
                animation: "flameUp 0.7s ease-in-out infinite",
              }}
            />
          </div>

          {/* Reels */}
          <div
            className="absolute flex items-center justify-center w-full h-full"
            style={{
              width: "57%",
              height: "61%",
              top: "1.6cm",
              right: "21.5%",
              zIndex: 20,
              display: "grid",
              gridTemplateColumns: `repeat(${REELS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {Array.from({ length: REELS }, (_, reelIndex) => (
              <Reel
                key={reelIndex}
                spinning={spinning && !reelsStopped[reelIndex]}
                visibleRows={ROWS}
                cellSize={CELL_SIZE}
                strip={strips[reelIndex]}
                resultColumn={result.map((row) => row[reelIndex])}
                wildFxKey={freeSpinAnimKey} // المفتاح يتجدد تلقائياً
                wildWin={inFreeSpins} // animation يتفعل لما Free Spins تكون true
              />
            ))}
          </div>

          {/* Fire-box overlay on wild columns when win */}
          {showWildBox && wildCols.some(Boolean) && (
            <div
              key={`wildbox-${wildBoxKey}`}
              className="absolute pointer-events-none"
              style={{
                width: "57%",
                height: "61%",
                top: "1.6cm",
                right: "21.5%",
                zIndex: 30,
                display: "grid",
                gridTemplateColumns: `repeat(${REELS}, 1fr)`,
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                animation: "none", // 🚫 إيقاف أي animation
                opacity: 1,
              }}
            >
              {wildCols.map((isWild, c) =>
                isWild ? (
                  <React.Fragment key={`col-${c}-${wildBoxKey}`}>
                    <div
                      style={{
                        gridColumn: `${c + 1} / ${c + 2}`,
                        gridRow: `1 / ${ROWS + 1}`,
                        position: "relative",
                        animation: "none", // 🚫 إيقاف أي animation
                        opacity: 1,
                      }}
                    ></div>

                    {Array.from({ length: ROWS }).map((_, r) => {
                      // const base = r * 70;
                      return (
                        <div
                          key={`stickcell-${c}-${r}-${wildBoxKey}`}
                          style={{
                            gridColumn: `${c + 1} / ${c + 2}`,
                            gridRow: `${r + 1} / ${r + 2}`,
                            position: "relative",
                            animation: "none", // 🚫 إيقاف أي animation
                            opacity: 1,
                          }}
                        >
                          {/* الخطوط اتشالت هون */}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ) : null
              )}
            </div>
          )}

          {/* BIG WIN overlay (>=3) */}
          {showBigWin && (
            <div
              key={`bigwin-${bigWinKey}`}
              className="pointer-events-none fixed inset-0 z-[1100]"
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(60% 60% at 50% 45%, rgba(20,35,60,.75) 0%, rgba(5,9,16,.92) 70%)",
                  zIndex: 0,
                }}
              />
              <img
                src={fxBlue}
                alt="blue effect"
                style={{
                  position: "absolute",
                  left: "53%",
                  top: "63%",
                  transform: "translate(-50%,-50%)",
                  width: "min(84vw, 1200px)",
                  maxWidth: "1200px",
                  opacity: 0,
                  filter: "brightness(1.05) saturate(1.18) blur(0.2px)",
                  mixBlendMode: "screen",
                  animation:
                    "blue-appear 600ms ease-out forwards, blue-breathe 2200ms ease-in-out 600ms infinite",
                  zIndex: 0,
                }}
              />
              <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                {bigWinCoins.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: `${c.leftVW}vw`,
                      top: "-16vh",
                      animation: `coin-fall var(--fallDur) ease-out var(--delay) forwards`,
                      "--drift": `${c.driftPX}px`,
                      "--fall": `${c.fallVH}vh`,
                      "--delay": `${c.delayS}s`,
                      "--fallDur": `${c.fallDurS}s`,
                      willChange: "transform, opacity",
                    }}
                  >
                    <div
                      style={{
                        animation: `coin-spin var(--spinDur) linear var(--delay) infinite`,
                        "--spinDur": `${c.spinDurS}s`,
                        willChange: "transform",
                      }}
                    >
                      <CoinSVG size={c.size} />
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: "translateY(-2%)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(48px, 9vw, 136px)",
                      fontWeight: 900,
                      color: "#ffd45e",
                      WebkitTextStroke: "6px #3c2a00",
                      letterSpacing: "2px",
                      textShadow:
                        "0 0 14px rgba(255,210,90,.9), 0 0 32px rgba(255,170,0,.85), 0 10px 28px rgba(0,0,0,.55)",
                      animation: "bw-title-pop 800ms ease-out forwards",
                    }}
                  >
                    BIG&nbsp;WIN
                  </div>

                  <img
                    src={fxAbove}
                    alt="decor top"
                    style={{
                      width: "min(62vw, 860px)",
                      maxWidth: "860px",
                      marginTop: "0.15em",
                      filter: "drop-shadow(0 0 14px rgba(255,210,110,.9))",
                      opacity: 0,
                      animation:
                        "flower-pop 650ms ease-out 100ms forwards, float-sway 2200ms ease-in-out 900ms infinite alternate",
                    }}
                  />

                  <div
                    style={{
                      marginTop: "0.05em",
                      fontSize: "clamp(36px, 7vw, 104px)",
                      fontWeight: 800,
                      color: "#fff6c9",
                      WebkitTextStroke: "4px #4a3200",
                      textShadow:
                        "0 0 12px rgba(255,220,150,.95), 0 0 26px rgba(255,170,0,.85)",
                      animation: "bw-amount-pop 900ms ease-out 80ms forwards",
                    }}
                  >
                    {lastWin.toFixed(2)}
                  </div>

                  <img
                    src={fxBelow}
                    alt="decor bottom"
                    style={{
                      width: "min(62vw, 860px)",
                      maxWidth: "860px)",
                      marginTop: "0.05em",
                      filter: "drop-shadow(0 0 14px rgba(255,210,110,.9))",
                      opacity: 0,
                      animation:
                        "flower-pop 650ms ease-out 160ms forwards, float-sway 2200ms ease-in-out 1000ms infinite alternate-reverse",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Normal Win FX overlay */}
          {showWinFX && (
            <div
              key={winFxKey}
              className="pointer-events-none fixed inset-0 z-[999]"
              style={{ overflow: "visible", willChange: "transform, opacity" }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center font-extrabold"
                style={{
                  fontSize: "8rem",
                  color: "#ffe27a",
                  WebkitTextStroke: "5px #5a3b00",
                  textShadow:
                    "0 0 12px rgba(255,210,90,.95), 0 0 28px rgba(255,180,0,.9), 0 10px 24px rgba(0,0,0,.55)",
                  animation: `win-pop 0.5s ease-out, win-fade-out 0.5s ease-in 0.9s forwards`,
                }}
              >
                {lastWin.toFixed(2)}
              </div>

              {winFxCoins.map((c, idx) => (
                <div
                  key={idx}
                  className="absolute"
                  style={{
                    left: `${c.leftVW}vw`,
                    top: "-16vh",
                    animation: `coin-fall var(--fallDur) ease-out var(--delay) forwards`,
                    "--drift": `${c.driftPX}px`,
                    "--fall": `${c.fallVH}vh`,
                    "--delay": `${c.delayS}s`,
                    "--fallDur": `${c.fallDurS}s`,
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    style={{
                      animation: `coin-spin var(--spinDur) linear var(--delay) infinite`,
                      "--spinDur": `${c.spinDurS}s`,
                      willChange: "transform",
                    }}
                  >
                    <CoinSVG size={c.size} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== Bottom Control Bar ===== */}
          <div
            className="absolute bottom-0.5 w-full px-6 py-3 rounded-lg shadow-lg flex items-center gap-20 left-95"
            style={{ position: "absolute" }}
          >
            {/* PER LINE / FREE SPINS */}
            <div
              className="flex items-center text-white font-bold"
              style={{
                position: "absolute",
                left: LEFT_BLOCK_LEFT,
                transform: "translateX(-50%)",
                bottom: "0.75rem",
                zIndex: 40,
              }}
            >
              {inFreeSpins ? (
                <div className="flex flex-col items-center">
                  <div className="text-xl opacity-80">FREE SPIN</div>
                  <div className="relative flex items-center justify-center">
                    <img src={resul} alt="Result" className="w-35 h-10" />
                    <div className="absolute text-white font-bold text-lg">
                      {freeSpins}
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-white font-bold">
                    <div className="text-sm opacity-80">
                      TOTAL BET {(betPerLine * LINES).toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={decreaseBet}>
                    <img
                      src={minus}
                      alt="Decrease Bet"
                      className="w-10 h-10 px-0.5 py-1"
                    />
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="text-xl opacity-80">PERLINE</div>
                    <div className="relative flex items-center justify-center">
                      <img src={resul} alt="Result" className="w-35 h-10" />
                      <div className="absolute text-white font-bold text-lg">
                        {betPerLine.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-white font-bold">
                      <div className="text-sm opacity-80">
                        TOTAL BET {(betPerLine * LINES).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <button onClick={increaseBet}>
                    <img
                      src={plus}
                      alt="Increase Bet"
                      className="w-11 h-11 px-1 py-1"
                    />
                  </button>
                </>
              )}
            </div>

            {/* CENTER BLOCK: BUY + SPIN + AUTOPLAY */}
            <div
              className="flex items-center justify-center gap-3"
              style={{
                position: "absolute",
                left: CENTER_BLOCK_LEFT,
                transform: "translateX(-50%)",
                bottom: CENTER_BLOCK_BOTTOM,
                zIndex: 40,
              }}
            >
              {/* BUY as plain image button */}
              <button
                onClick={onOpenBuy}
                className="relative w-14 h-14 rounded-xl overflow-hidden"
                aria-label="Buy Feature"
                title="Buy Feature"
                style={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                  background: "transparent",
                  padding: 0,
                }}
              >
                <img
                  src={buyImg}
                  alt="BUY"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  style={{ filter: "none" }}
                />
              </button>

              {/* SPIN (second design) */}
              <button
                onClick={startSpin}
                disabled={
                  spinning || (!inFreeSpins && balance < betPerLine * LINES)
                }
                className="relative w-14 h-14 disabled:opacity-90"
              >
                <div className="relative w-full h-full">
                  <img
                    src={spinImg}
                    alt="Spin"
                    className="w-25 h-15 object-contain"
                  />
                  {!spinning && (
                    <img
                      src={another}
                      alt="Overlay"
                      className="absolute top-1/2 left-1/2 w-12 h-10 -translate-x-1/2 -translate-y-1/2 z-10"
                    />
                  )}
                </div>

                <span className="absolute inset-0 flex items-center justify-center font-bold text-black text-sm">
                  {spinning ? (
                    <div className="relative w-full h-full">
                      <img
                        src={spinImg}
                        alt="Spin"
                        className="w-25 h-15 object-contain"
                      />
                      <img
                        src={loadingImg}
                        alt="Overlay"
                        className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-10"
                      />
                    </div>
                  ) : !inFreeSpins && balance < betPerLine * LINES ? (
                    "NO $"
                  ) : inFreeSpins ? (
                    ""
                  ) : (
                    <img
                      src={spinImg}
                      alt="Spin"
                      className="w-160 h-160 object-contain"
                    />
                  )}
                </span>
              </button>

              {/* AutoPlay */}
              <AutoPlayButton startSpin={startSpin} interval={2000} />
            </div>

            <div
              className="flex flex-col items-center text-white"
              style={{
                position: "absolute",
                bottom: "0.3rem",
                left: WIN_ANCHOR_LEFT,
                transform: "translateX(-50%)",
                zIndex: 90,
                width: WIN_WIDTH,
              }}
            >
              <div className="text-sm opacity-80 font-bold">WIN</div>
              <div
                className={`relative flex items-center justify-center ${
                  lastWin > 0 ? "animate-fireGlow rounded-lg px-3 py-1" : ""
                }`}
                style={{ width: WIN_WIDTH, height: WIN_HEIGHT }}
              >
                <img
                  src={resul}
                  alt="Result"
                  className="absolute inset-0 object-contain"
                  style={{ width: "100%", height: "100%" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center text-white font-extrabold"
                  style={{ fontSize: WIN_FONT_SIZE, lineHeight: 1 }}
                >
                  {spinning ? "-" : lastWin.toString()}
                </div>
              </div>
              <div className="text-sm opacity-80 mt-2">
                BALANCE {balance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* ===== Keyframes ===== */}
          <style>{`
            @keyframes win-pop {
              0%   { transform: scale(0.6); opacity: 0; }
              25%  { transform: scale(1.2); opacity: 1; }
              60%  { transform: scale(1.05); }
              100% { transform: scale(1.0); opacity: 1; }
            }
            @keyframes win-fade-out {
              0%   { opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes coin-fall {
              0% { transform: translate(0, -10vh); opacity: 0; }
              12% { opacity: 1; }
              100% { transform: translate(var(--drift), var(--fall)); opacity: 0; }
            }
            @keyframes coin-spin {
              0%   { transform: rotateY(0deg); }
              50%  { transform: rotateY(180deg); }
              100% { transform: rotateY(360deg); }
            }
           


            @keyframes bw-title-pop {
              0% { transform: scale(0.65); opacity: 0; }
              30% { transform: scale(1.15); opacity: 1; }
              60% { transform: scale(1.04); }
              100% { transform: scale(1.00); }
            }
            @keyframes bw-amount-pop {
              0% { transform: scale(0.7); opacity: 0; }
              35% { transform: scale(1.12); opacity: 1; }
              100% { transform: scale(1.00); }
            }
            @keyframes blue-appear {
              0% { transform: translate(-50%,-48%) scale(0.96); opacity: 0; }
              60% { opacity: .85; }
              100% { transform: translate(-50%,-50%) scale(1.00); opacity: .85; }
            }
            @keyframes blue-breathe {
              0% { transform: translate(-50%,-50%) scale(1.00); filter: brightness(1.05) saturate(1.18); }
              50% { transform: translate(-50%,-50%) scale(1.03); filter: brightness(1.18) saturate(1.28); }
              100% { transform: translate(-50%,-50%) scale(1.00); filter: brightness(1.05) saturate(1.18); }
            }
            @keyframes flower-pop {
              0% { transform: scale(.85); opacity: 0; }
              60% { transform: scale(1.06); opacity: 1; }
              100% { transform: scale(1.00); opacity: 1; }
            }
            @keyframes float-sway {
              0% { transform: translateY(0px) rotate(0deg); }
              100% { transform: translateY(2.5px) rotate(.3deg); }
            }
            @keyframes flameUp {
              0%, 100% { transform: translateX(-50%) translateY(0) scale(1); filter: brightness(1); opacity: .95; }
              50%      { transform: translateX(-50%) translateY(-3px) scale(1.08); filter: brightness(1.08); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
