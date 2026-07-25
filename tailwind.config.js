/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A4A",
          light: "#2A3D63",
          dark: "#121D33",
        },
        rust: {
          DEFAULT: "#E8622C",
          dark: "#C64E1E",
          light: "#F2895D",
        },
        cloth: "#F7F5F1",
        ink: "#1F2937",
        leaf: "#1F8A5F",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(27,42,74,0.08), 0 1px 2px rgba(27,42,74,0.06)",
      },
    },
  },
  plugins: [],
};
