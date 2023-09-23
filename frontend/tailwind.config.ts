import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-backg": "#202225",
        "custom-nav": "#2F3136",
        "custom-blue": "#3F4BD1",
        "custom-green": "#48C78E",
      },
    },
  },
  plugins: [require("daisyui")],
};

export default config;
