// @ts-nocheck
import wildImage from "./assets/wild.jpg";
import freeSpinsImage from "./assets/freespins.jpg";
import Elephant from "./assets/eleph.jpg";
import giraffe from "./assets/jeag.jpg";
import Lion from "./assets/lion.jpg";
import animal from "./assets/animal.jpg";
import letterk from "./assets/letterk.png";
import lettera from "./assets/lettera.png";
import letterq from "./assets/letterq.png";
import number from "./assets/number10.png";
import letterj from "./assets/let.png";

export const SYMBOLS = [
  { key: "ELEPHANT", img: Elephant },
  { key: "LION", img: Lion },
  { key: "GIRAFFE", img: giraffe },
  { key: "RHINO", img: animal },
  { key: "A", img: lettera },
  { key: "K", img: letterk },
  { key: "Q", img: letterq },
  { key: "J", img: letterj },
  { key: "10", img: number },
  { key: "IMAGE1", img: wildImage },
  { key: "IMAGE2", img: freeSpinsImage },
];

export const REELS = 5;
export const ROWS = 4;
export const CELL_SIZE = 100;
export const LINES = 25;
export const STEPS = [0.01, 0.02, 0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10];

export const PAYTABLE = {
  ELEPHANT: { 3: 30, 4: 120, 5: 600 },
  LION: { 3: 40, 4: 200, 5: 1000 },
  GIRAFFE: { 3: 20, 4: 40, 5: 200 },
  RHINO: { 3: 15, 4: 30, 5: 100 },
  A: { 3: 10, 4: 15, 5: 50 },
  K: { 3: 5, 4: 10, 5: 40 },
  Q: { 3: 5, 4: 10, 5: 40 },
  J: { 3: 5, 4: 10, 5: 30 },
  10: { 3: 5, 4: 10, 5: 30 },
  IMAGE1: { 5: 2000 },
};

export const PAYLINES = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [3, 3, 3, 3, 3],
  [0, 1, 2, 1, 0],
  [3, 2, 1, 2, 3],
  [0, 0, 1, 0, 0],
  [3, 3, 2, 3, 3],
  [1, 0, 0, 0, 1],
  [2, 3, 3, 3, 2],
  [0, 1, 1, 1, 0],
  [3, 2, 2, 2, 3],
  [1, 2, 3, 2, 1],
  [2, 1, 0, 1, 2],
  [0, 1, 0, 1, 0],
  [3, 2, 3, 2, 3],
  [1, 1, 0, 1, 1],
  [2, 2, 3, 2, 2],
  [0, 0, 3, 0, 0],
  [3, 3, 0, 3, 3],
  [1, 2, 1, 2, 1],
  [2, 1, 2, 1, 2],
  [0, 2, 0, 2, 0],
  [3, 1, 3, 1, 3],
  [0, 3, 0, 3, 0],
];

export const randSym = (excludeWild = false) => {
  const pool = excludeWild
    ? SYMBOLS.filter((s) => s.key !== "IMAGE1")
    : SYMBOLS;
  return pool[Math.floor(Math.random() * pool.length)];
};

export function generateFreeSpinResult() {
  const baseResult = Array.from({ length: ROWS }, () =>
    Array.from({ length: REELS }, () => randSym(true))
  );

  const eligibleReels = [0, 2, 4];

  const rand = Math.random();
  let wildReelsCount = 1;

  if (rand < 0.6) {
    wildReelsCount = 1;
  } else if (rand < 0.9) {
    wildReelsCount = 2;
  } else {
    wildReelsCount = 3;
  }

  const shuffled = [...eligibleReels].sort(() => Math.random() - 0.5);
  const chosenColumns = shuffled.slice(0, wildReelsCount);

  chosenColumns.forEach((col) => {
    for (let row = 0; row < ROWS; row++) {
      baseResult[row][col] = { key: "IMAGE1", img: wildImage };
    }
  });

  return baseResult;
}

export function checkFreeSpins(result) {
  let count = 0;
  result.flat().forEach((sym) => {
    if (sym.key === "IMAGE2") count++;
  });
  return count >= 3 ? 10 : 0;
}

export function calcWin(result, betPerLine) {
  let win = 0;

  PAYLINES.forEach((line) => {
    const symbolsInLine = line.map((rowIndex, col) => result[rowIndex][col]);

    if (symbolsInLine.every((s) => s.key === "IMAGE1")) {
      win += PAYTABLE.IMAGE1[5] * betPerLine;
      return;
    }

    let base = null;
    let count = 0;
    let wildBuffer = 0;

    for (let col = 0; col < REELS; col++) {
      const sym = symbolsInLine[col];

      if (!base) {
        if (sym.key === "IMAGE1") {
          wildBuffer++;
        } else if (sym.key !== "IMAGE2") {
          base = sym.key;
          count = 1 + wildBuffer;
          wildBuffer = 0;
        } else break;
      } else {
        if (sym.key === base || sym.key === "IMAGE1") {
          count++;
        } else break;
      }
    }

    if (base && count >= 3) {
      const payouts = PAYTABLE[base];
      if (payouts && payouts[count]) {
        win += payouts[count] * betPerLine;
      }
    }
  });

  return +win.toFixed(2);
}
