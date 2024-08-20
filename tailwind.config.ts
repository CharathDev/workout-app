import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "dark-gray": "#2b2d42",
        "light-gray": "#8d99ae",
        "darker-white": "#edf2f4",
        "light-red": "#ef233c",
        "darker-red": "#d90429",
      },
      gap: {
        "0.5": "2px",
      },
    },
  },
  plugins: [],
};
export default config;
