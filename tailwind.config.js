/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cloth: "rgb(var(--color-bg) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        navy: {
          DEFAULT: "rgb(var(--color-navy) / <alpha-value>)",
          light: "rgb(var(--color-navy-light) / <alpha-value>)",
          dark: "rgb(var(--color-navy-dark) / <alpha-value>)",
        },
        rust: {
          DEFAULT: "rgb(var(--color-rust) / <alpha-value>)",
          dark: "rgb(var(--color-rust-dark) / <alpha-value>)",
          light: "rgb(var(--color-rust-light) / <alpha-value>)",
        },
        leaf: "rgb(var(--color-leaf) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
      },
      backgroundColor: {
        white: "rgb(var(--color-surface) / <alpha-value>)",
      },
      borderColor: {
        white: "rgb(var(--color-surface) / <alpha-value>)",
      },
      textColor: {
        white: "rgb(var(--color-text-white) / <alpha-value>)",
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
