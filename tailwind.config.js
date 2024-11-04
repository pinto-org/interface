const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // also change in src/utils/theme/breakpoints.ts
    screens: {
      sm: "768px",
      md: "900px",
      lg: "1100px",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "768px",
        md: "900px",
        lg: "1100px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        pinto: {
          DEFAULT: "#246645",
          green: "#246645",
          "red-2": "#FF0000",
          "green-1": "#D8F1E2",
          "green-2": "#00C767",
          "green-3": "#246645",
          "green-4": "#007339",
          "off-green": "#9A9F6C",
          "gray-1": "#F8F8F8",
          "gray-2": "#D9D9D9",
          "gray-3": "#B9B9B9",
          "gray-4": "#9C9C9C",
          "gray-5": "#404040",
          "gray-blue": "#E9F0F6",
          "off-white": "#FCFCFC",
          "yellow-1": "#FEE18C",
          "stalk-gold": "#D3B567",
          "seed-silver": "#7B9387",
          "pod-bronze": "#9F7F54",
          "red-2": "#FF0000",
        },
      },
      backgroundImage: {
        "pinto-morning":
          "linear-gradient(90deg, rgba(233, 231, 224, 0.2) 0%, rgba(254, 225, 140, 0.2) 0.01%, rgba(241, 248, 140, 0.4) 100%)",
        "pinto-morning-strong":
          "linear-gradient(90deg, #E9E7E0 0%, #FEE18C 52.5%, #F1F88C 100%);",
        "pinto-mobile-navi":
          "linear-gradient(90deg, rgba(233, 231, 224, 0.2) 0%, rgba(254, 225, 140, 0.2) 52.5%, rgba(241, 248, 140, 0.2) 100%)",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      dropShadow: {
        "pinto-token-select": "0px 1px 8px 0px rgba(233, 240, 246, 1)",
      },
      fontFamily: {
        pinto: ["Pinto", "system-ui", "sans-serif"],
        roboto: ["Roboto", "system-ui", "sans-serif"],
      },
      gridTemplateColumns: {
        frame: "350px, 1fr, 200px",
        frameMobile: "350px,  1fr",
      },
      maxWidth: {
        "panel-price": "600px",
        "panel-seasons": "min(914px, calc(100vw - 48px))",
      },
      width: {
        "panel-price": "600px",
        "panel-seasons": "min(914px, calc(100vw - 48px))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX( 0% )" },
          to: { transform: "translateX( -100% )" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 24s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
