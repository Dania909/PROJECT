import coverImg from "../assets/cover.jpg";

export default function Cover({ onStart }) {
  return (
    <div className="min-h-screen relative bg-[#08130f] overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${coverImg})` }}
      />
      <div className="absolute inset-0 bg-black/28" />

      <div className="absolute left-1/2 -translate-x-1/2 bottom-[5%]">
        <button
          onClick={onStart}
          className="
            relative inline-flex items-center justify-center overflow-hidden
            px-10 py-3 rounded-[14px] transform-gpu
            bg-gradient-to-b from-[#71ff79] to-[#27d53c]
            border-4 border-[#d8a64a] tracking-wide text-2xl font-extrabold
            shadow-[0_6px_0_#7a5b24,0_0_22px_rgba(0,0,0,.55)]
            hover:brightness-110 active:translate-y-[1px]
            animate-start-dance
          "
        >
          {/* GOLD text */}
          <span className="relative z-[1] bg-gradient-to-b from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            START
          </span>

          {/* moving shine bar */}
          <span
            className="
              pointer-events-none absolute inset-y-0 -left-[120%] w-[40%] skew-x-[-25deg]
              bg-gradient-to-r from-transparent via-white/35 to-transparent
              blur-[1px] animate-start-shine
            "
          />
        </button>
      </div>
    </div>
  );
}
