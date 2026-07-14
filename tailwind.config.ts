import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202A",
        mist: "#F4F7FA",
        sakura: "#E85D75",
        matcha: "#5E8C61",
        ocean: "#2F6F9F",
        gold: "#C98B2B",
        academy: "#8E1F2C",
        parchment: "#FFF7EA",
        umber: "#5B2B1F"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
