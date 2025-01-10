import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
      "2xlmax": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xlmax: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lgmax: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      mdmax: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      smmax: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("daisyui"),
  ],
} satisfies Config;
