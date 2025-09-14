import React from "react";

export function Cell({ sym, size }) {
  // Tune these two to change how much narrower things are
  const ANIMAL_MAX_WIDTH_PCT = 98; // animals ~90% of cell width
  const OTHER_MAX_WIDTH_PCT  = 98; // letters/numbers ~94% of cell width
  const MAX_HEIGHT_PCT       = 98; // keep a tiny vertical breathing room

  const isAnimal =
    sym.key === "IMAGE2" ||
    sym.key === "LION"   ||
    sym.key === "GIRAFFE"||
    sym.key === "RHINO";

  return (
    <div
      className="flex items-center justify-center font-black select-none w-full h-full"
      style={{
        minWidth: size,
        minHeight: size,
        overflow: "hidden", // prevent any overflow clipping
      }}
    >
      {sym?.img ? (
        <img
          src={sym.img}
          alt={sym.key}
          // We center via parent flex; here we just constrain the image
          style={{
            maxWidth: `${isAnimal ? ANIMAL_MAX_WIDTH_PCT : OTHER_MAX_WIDTH_PCT}%`,
            maxHeight: `${MAX_HEIGHT_PCT}%`,
            width: "auto",
            height: "auto",
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : null}
    </div>
  );
}
