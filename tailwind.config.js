const plugin = require("tailwindcss");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // also change in src/utils/theme/breakpoints.ts
    screens: {
      xs: "400px",
      sm: "768px",
      md: "900px",
      lg: "1100px",
      xl: "1200px",
      "2xl": "1400px",
      "3xl": "1600px"
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "400px",
        sm: "768px",
        md: "900px",
        lg: "1100px",
        xl: "1200px",
        "2xl": "1400px",
        "3xl": "1600px"
      },
    },
    extend: {
      fontSize: {
        // Original font sizes
        h1: ["3.429rem", { lineHeight: "3.772rem" }],
        h2: ["2.25rem", { lineHeight: "2.475rem" }],
        h3: ["1.75rem", { lineHeight: "2.2rem" }],
        h4: ["1.5rem", { lineHeight: "1.65rem" }],
        lg: ["1.5rem", { lineHeight: "1.375rem" }],
        body: ["1.25rem", { lineHeight: "1.375rem" }],
        sm: ["1rem", { lineHeight: "1.1rem" }],
        xs: ["0.875rem", { lineHeight: ".9625rem" }],
        inherit: "inherit",
      },
      fontWeight: {
        thin: "300",
        light: "340",
        regular: "400",
        medium: "500",
        inherit: "inherit",
      },
      letterSpacing: {
        "body-light": "-0.025rem",
        h3: "-0.04rem",
        h2: "-0.0315rem",
        h4: "-0.003rem",
        inherit: "inherit",
      },
      lineHeight: {
        "same-h1": "3.429rem",
        "same-h2": "2.25rem",
        "same-h3": "2rem",
        "same-h4": "1.5rem",
        "same-body": "1.25rem",
        "same-sm": "1rem",
        "same-xs": "0.875rem",
        inherit: "inherit",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        errorRing: "hsl(var(--error-ring))",
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
          "red-1": "#FCEFEF",
          "red-2": "#FF0000",
          "green-1": "#D8F1E2",
          "green-2": "#00C767",
          "green-3": "#246645",
          "green-4": "#387F5C",
          "green-5": "#0CB763",
          "orange-1": "#FFF6EA",
          "off-green": "#9A9F6C",
          "off-green-bg": "#EFEEDF",
          "gray-1": "#F8F8F8",
          "gray-2": "#D9D9D9",
          "gray-3": "#B9B9B9",
          "gray-4": "#9C9C9C",
          "gray-5": "#404040",
          "gray-6": "#6E6E6E", // Not in figma
          "gray-blue": "#E9F0F6",
          "off-white": "#FCFCFC",
          "morning-yellow-0": "#E9E7E0",
          "morning-yellow-1": "#FEE18C",
          "morning-yellow-2": "#F1F88C",
          "warning-yellow": "#DCB505",
          "warning-orange": "#ED7A00",
          "yellow-active": "#CCA702",
          "stalk-gold": "#D3B567",
          "seed-silver": "#7B9387",
          "pod-bronze": "#9F7F54",
          "red-2": "#FF0000",
          "purple-2": "#C9B3F4",
          morning: "#D9AD0F",
          "morning-orange": "#FBE39B",
          primary: "#000000", // black clsx("text-black"),
          secondary: "#404040", // pinto-gray-5 clsx("text-pinto-gray-5"),
          "med-light": "#6E6E6E",  // pinto-gray-6 clsx("text-pinto-gray-6"),
          light: "#9C9C9C", // pinto-gray-4 clsx("text-pinto-gray-4"),
          lighter: "#B9B9B9", // pinto-gray-3 clsx("text-pinto-gray-3"),
          success: "#00C767", // pinto-green-2 clsx("text-pinto-green-2"),
          error: "#FF0000", // pinto-red-2 clsx("text-pinto-red-2"),
        },
      },
      backgroundImage: {
        "pinto-morning":
          "linear-gradient(90deg, rgba(233, 231, 224, 0.2) 0%, rgba(254, 225, 140, 0.2) 0.01%, rgba(241, 248, 140, 0.4) 100%)",
        "pinto-morning-strong":
          "linear-gradient(90deg, #E9E7E0 0%, #FEE18C 52.5%, #F1F88C 100%);",
        "pinto-mobile-navi":
          "linear-gradient(90deg, rgba(233, 231, 224, 0.2) 0%, rgba(254, 225, 140, 0.2) 52.5%, rgba(241, 248, 140, 0.2) 100%)",
        "pinto-gradient-green":
          "linear-gradient(315deg, hsla(66, 21%, 52%, 0.5) 0%, hsla(114, 32%, 63%, 0.95) 50%, hsla(119, 32%, 61%, 1) 100%)",
        "morning-border":
          "linear-gradient(90deg, #E9E7E0 0%, #FEE18C 52.5%, #F1F88C 100%)",
        "morning-light":
          "linear-gradient(90deg, rgba(233, 231, 224, 0.2) 0%, rgba(254, 225, 140, 0.2) 0.01%, rgba(241, 248, 140, 0.4) 100%)",
        "gradient-primary":
          "radial-gradient(101.96% 101.96% at 50.15% 0%, #88C4A6 12.79%, #68AD8B 29.68%, #45906A 46.1%, #387F5C 64%, #246645 84.06%)",
        "gradient-primary-hover":
          "radial-gradient(101.96% 101.96% at 50.15% 0%, #C5EBD8 0%, #88C4A6 9.41%, #68AD8B 20.41%, #45906A 44.41%, #387F5C 59.41%, #246645 85.41%, #164E32 100%)",
        "gradient-lighter-1":
          "linear-gradient(90deg, rgba(233, 231, 224, 0.02) 0%, rgba(254, 225, 140, 0.02) 0.01%, rgba(241, 248, 140, 0.04) 100%)",
        "gradient-lighter-2":
          "linear-gradient(90deg, #E9E7E0 0%, #FEE18C 52.5%, #F1F88C 100%)",
        "dot-grid": "radial-gradient(#D9D9D9 2px, transparent 2px)",
        'double-fade': 'linear-gradient(270deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.00) 50%, rgba(255, 255, 255, 0.50) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.00) 50%, rgba(255, 255, 255, 0.50) 100%)',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 0.5rem)", // 20px
        lg: `var(--radius)`, //12px
        md: `calc(var(--radius) - 0.125rem)`, //10px
        sm: "calc(var(--radius) - 0.25rem)", //8px
      },
      dropShadow: {
        "pinto-token-select": "0px 1px 8px 0px rgba(233, 240, 246, 1)",
      },
      fontFamily: {
        pinto: ["Pinto", "system-ui", "sans-serif"],
        roboto: ["Roboto", "system-ui", "sans-serif"],
        menlo: ["Menlo", "Monaco", "Courier New", "monospace"],
      },
      gridTemplateColumns: {
        frame: "350px, 1fr, 200px",
        frameMobile: "350px,  1fr",
      },
      maxWidth: {
        "panel-price": "37.5rem",
        "panel-seasons": "min(914px, calc(100vw - 48px))",
        "panel-seasons-sm": "min(720px, calc(100vw - 48px))",
        "dialog-600": "min(600px, calc(100vw - 32px))",
      },
      width: {
        "panel-price": "37.5rem",
        "panel-seasons": "min(914px, calc(100vw - 48px))",
        "panel-seasons-sm": "min(720px, calc(100vw - 48px))",
      },
      minWidth: {
        "dialog-600": "min(600px, calc(100vw - 32px))",
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
          to: { transform: "translateX( -50% )" },
        },
        "pulse-scale": {
          "0%, 100%": { transform: "scale(0.98)" },
          "50%": { transform: "scale(1.02)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX( -50% )" },
          to: { transform: "translateX( 0% )" },
        },
        "vertical-marquee": {
          from: { transform: "translateY( 0% )" },
          to: { transform: "translateY( -200% )" },
        },
        "vertical-marquee-reverse": {
          from: { transform: "translateY( -300% )" },
          to: { transform: "translateY( 0% )" },
        },
        "vertical-marquee-small": {
          from: { transform: "translateY( 0% )" },
          to: { transform: "translateY( -100% )" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "text-background-scroll": {
          "0%": { backgroundPosition: "100% 50%"},
          "100%": { backgroundPosition: "0% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px var(--glow-color, rgba(36, 102, 69, 0.4))" 
          },
          "50%": { 
            boxShadow: "0 0 30px var(--glow-color, rgba(36, 102, 69, 0.7))" 
          },
        },
        "fade-in-smooth": {
          "0%": { 
            opacity: "0"
          },
          "100%": { 
            opacity: "1"
          },
        },
        "fade-out-smooth": {
          "0%": { 
            opacity: "1"
          },
          "100%": { 
            opacity: "0"
          },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 24s linear infinite",
        "marquee-reverse": "marquee-reverse 24s linear infinite",
        "long-marquee": "marquee 90s linear infinite",
        "long-marquee-reverse": "marquee-reverse 90s linear infinite",
        "vertical-marquee": "vertical-marquee 36s linear infinite",
        "vertical-marquee-reverse": "vertical-marquee-reverse 54s linear infinite",
        "vertical-marquee-small": "vertical-marquee-small 80s linear infinite",
        "text-background-scroll": "text-background-scroll 5s linear infinite",
        "pulse-glow": "pulse-glow 8s ease-in-out infinite",
        "fade-in-smooth": "fade-in-smooth 0.25s ease-out",
        "fade-out-smooth": "fade-out-smooth 0.2s ease-in",
        "fade-in": "fade-in 0.1s ease-in-out",
      },
      aspectRatio: {
        "3/1": "3 / 1",
        "6/1": "6 / 1",
      },
      transitionDuration: {
        "1500": "1500ms",
      },
      scrollbar: {
        none: {
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none", // IE 10+
          "scrollbar-width": "none", // Firefox
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addComponents }) => {
      addComponents({
        // Text variants as complete utilities
        ".pinto-h1": {
          "@apply text-h1 font-thin tracking-normal": {},
        },
        ".pinto-h2": {
          "@apply text-h2 font-thin tracking-h2": {},
        },
        ".pinto-h3": {
          "@apply text-h3 font-light tracking-h3 sm:text-[2rem]":
            {},
        },
        ".pinto-h4": {
          "@apply text-h4 font-regular tracking-h4": {},
        },
        ".pinto-lg": {
          "@apply text-lg font-light": {},
        },
        ".pinto-body": {
          "@apply text-body font-regular": {},
        },
        ".pinto-body-light": {
          "@apply text-body font-light tracking-body-light":
            {},
        },
        ".pinto-body-bold": {
          "@apply text-body font-medium": {},
        },
        ".pinto-sm": {
          "@apply text-sm font-regular": {},
        },
        ".pinto-sm-light": {
          "@apply text-sm font-light": {},
        },
        ".pinto-sm-bold": {
          "@apply text-sm font-medium": {},
        },
        ".pinto-xs": {
          "@apply text-xs font-light": {},
        },
        ".pinto-inherit": {
          "@apply text-inherit leading-inherit font-inherit tracking-inherit":
            {},
        },
      });
    },
    ({ addUtilities }) => {
      addUtilities({
        ".scrollbar-none": {
          "-ms-overflow-style": "none", // IE 10+
          "scrollbar-width": "none", // Firefox
        },
        ".scrollbar-none::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Opera
        },
      });
    },
    require("@tailwindcss/typography")
  ],
};
