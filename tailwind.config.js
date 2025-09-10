// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "flame-flicker": {
          "0%, 100%": { transform: "scale(1) translateY(0)", opacity: 0.95 },
          "50%": { transform: "scale(1.06) translateY(-2px)", opacity: 1 },
        },
      },
      animation: {
        "flame-flicker": "flame-flicker 0.7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
