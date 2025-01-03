/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-color": "var(--bg-color)", // Custom background color
        "p-color": "var(--p-color)", // Custom paragraph color
        "s-color": "var(--s-color)", // Custom secondary color
        "d-color": "var(--d-color)", // Custom dark color
      },
      fontFamily: {
        head: ["Times New Roman", "Times", "serif"],
        sub: ["Times New Roman", "Times", "serif"],
        text: ["Times New Roman", "Times", "serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
