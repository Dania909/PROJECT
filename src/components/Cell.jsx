import React from "react";

export function Cell({ sym, size, faded = false }) {
  return (
    <div
      className={`flex items-center justify-center font-black select-none ${
        faded ? "opacity-80" : ""
      }`}
      style={{
        width: size,
        height: size,
        // <-- خلي الخلفية شفافة
      }}
    >
      {sym.key === "IMAGE2" ||
      sym.key === "ELEPHANT" ||
      sym.key === "LION" ||
      sym.key === "GIRAFFE" ||
      sym.key === "RHINO" ? (
        <img
          src={sym.img}
          alt={sym.key}
          className="w-full h-full rounded-xl"
          style={{
            height: size - 2,
            objectFit: "cover", // <-- لتجنب أي فراغ أو خلفية
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {sym.img ? (
            <img
              src={sym.img}
              alt={sym.key}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
