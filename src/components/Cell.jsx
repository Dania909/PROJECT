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
        backgroundColor: "transparent", // شفافية الخلفية
      }}
    >
      {sym.key === "IMAGE2" ? (
        <img
          src={sym.img}
          alt="SCATTER"
          className="w-full h-full rounded-xl border border-yellow-400/50 shadow-lg"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      ) : sym.key === "WILD_FACE" ? (
        <img
          src={sym.img}
          alt="WILD FACE"
          className="w-full h-full rounded-xl border border-yellow-400/50 shadow-lg"
          style={{ objectFit: "cover", objectPosition: "top center" }}
        />
      ) : sym.key === "WILD_BODY" ? (
        <img
          src={sym.img}
          alt="WILD BODY"
          className="w-full h-full rounded-xl border border-yellow-400/50 shadow-lg"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      ) : sym.key === "ELEPHANT" ||
        sym.key === "LION" ||
        sym.key === "GIRAFFE" ||
        sym.key === "RHINO" ? (
        <img
          src={sym.img}
          alt={sym.key}
          className="w-full h-full rounded-xl"
          style={{
            height: size - 2,
            objectFit: "cover", // يمنع أي فراغ
          }}
        />
      ) : sym.emoji ? (
        <div className="text-3xl font-bold">{sym.emoji}</div>
      ) : sym.img ? (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={sym.img}
            alt={sym.key}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <img
          src={sym.img}
          alt={sym.key}
          className="w-[60px] h-[60px] object-contain"
        />
      )}
    </div>
  );
}