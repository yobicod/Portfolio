/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "sans-serif"], // Or BetterTogether
      },
      colors: {
        primary: "#FF5722",
        background: "#0f0f0f",
      },
    },
  },
  plugins: [],
};
