import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "blizz-color": "#00d1ff",
        "brown-1": "#6a4c36",
        "brown-2" : 'rgba(60,42,41,0.8)',
        "red-2" : 'rgb(178, 51, 0)',
      },
    },
  },
  plugins: [],
};
export default config;
