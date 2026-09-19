/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Custom colors for Campus Skill Exchange's design system.
        // Use these names (e.g. bg-ink, text-coral) anywhere in the app
        // instead of raw hex codes, so the whole app stays consistent.
        ink: "#1B2A4A",       // deep navy - headings, nav, primary buttons
        coral: "#FF6B5B",     // warm accent - CTAs, highlights
        sand: "#F7F5EF",      // page background
        sun: "#FFC857",       // secondary accent - badges, points
        mist: "#E7E4DA",      // borders, dividers
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}
