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
          DEFAULT: "#0F1B3D",
          light: "#2A3D63",
          dark: "#121D33",
        },
        rust: {
          DEFAULT: "#E8622C",
          dark: "#C64E1E",
          light: "#F2895D",
        },
        cloth: "#F4F5F7",
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
    },
  },
  plugins: [],
};
