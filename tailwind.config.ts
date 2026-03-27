import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#dbe9ff",
          200: "#bdd6ff",
          300: "#91b8ff",
          400: "#5e90ff",
          500: "#2f6af7",
          600: "#204fdd",
          700: "#1d41b3",
          800: "#1c388d",
          900: "#1e3270"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.06), 0 24px 80px rgba(47,106,247,.24)",
      },
      backgroundImage: {
        aurora: "radial-gradient(circle at top left, rgba(47,106,247,.24), transparent 32%), radial-gradient(circle at top right, rgba(16,185,129,.18), transparent 26%), linear-gradient(180deg, #070b17, #0b1020 42%, #090d17)"
      }
    }
  },
  plugins: []
} satisfies Config;
