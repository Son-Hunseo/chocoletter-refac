/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
const path = require("path");

module.exports = {
  mode: 'jit',
  future: {
    hoverOnlyWhenSupported: true, // 호버 기능이 지원되는 장치에서만 호버 스타일 적용
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      xxs: ".5rem",
      xs: ".75rem",
      "2xs": ".70rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    extend: {
      backgroundImage: {
        // 절대 경로로 이미지를 설정
        'letter-pink-background': `url(${path.resolve(
          __dirname,
          "./src/assets/images/letter/letter_pink.svg"
        )})`,
        'letter-blue-background': `url(${path.resolve(
          __dirname,
          "./src/assets/images/letter/letter_blue.svg"
        )})`,
      },
      height: { screen: '100dvh' },
      minHeight: { screen: '100dvh' },
      fontFamily: {
        sans: ["Dovemayo_gothic", "NeoDunggeunmo", "Arial", "sans-serif"],
        pretendard: ["Pretendard", "sans-serif"],
      },
      colors: {
        dotOutline: {
          100: "#1d005c",
          200: "#260b60",
          300: "#2f1763",
          400: "#392467",
          500: "#43316b",
          600: "#634f90",
          700: "#8772b5",
          800: "#b09cda",
          900: "#dcccff",
        },
        dotPurple: "#d5a7ea",
        dotPink: "#fb8bb0",
        dotYellow: "#fff0b2",
        dotRed: "#db443a",
        dotGray: "#dbdbdb",
        chocoletterOutline: {
          100: "#1d005c",
          200: "#260b60",
          300: "#2f1763",
          400: "#392467",
          500: "#43316b",
          600: "#634f90",
          700: "#8772b5",
          800: "#b09cda",
          900: "#dcccff",
        },
        chocoletterPurple: "#d5a7ea",
        chocoletterPurpleBold: "#9E4AFF",
        chocoletterPink: "#fb8bb0",
        chocoletterYellow: "#fff0b2",
        chocoletterRed: "#db443a",
        chocoletterGray: "#dbdbdb",
        chocoletterGiftBoxBg: "#efe1ff",
        chocoletterGiftBg: "#bfafd1",
        chocoletterDarkBlue: "#290059",
        chocoletterLightPurple: "#7d1cee",
        chocoletterWarning: "#ff3838",
        chocoletterLetterBgPink: "#ffeefd",
        chocoletterLetterBgBlue: "#FAFCFF",
        chocoletterCharacter: "#151517",
        chocoletterGreen: "#78E150",
        chocoletterTextYellow: "#FFF09A",
        chocoletterBackground: {
          light: "#E6F5FF",
          dark: "#F4D3FF",
          gradient: "linear-gradient(180deg, #E6F5FF 0%, #F4D3FF 81.5%)",
        },
      },
      keyframes: {
        slideWiggle: {
          "0%": { transform: "translateX(0%)" },
          "50%": { transform: "translateX(-30%)" },
          "100%": { transform: "translateX(0%)" },
        },
        reverseBounce: {
          "0%, 100%": { transform: "translateY(50%)" }, 
          "50%": { transform: "translateY(0%)" },
        },
      },
      animation: {
        slideWiggle: "slideWiggle 2s ease-in-out",
        reverseBounce: "reverseBounce 0.98s infinite",
      }
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".modal": {
          backgroundColor: "#fff",
          boxShadow: "0 0 0 0.25rem #43316b",
        },
        ".modal-header": {
          color: "#fff",
          height: "2.5rem",
          fontSize: "1.25rem",
          lineHeight: "2.5rem",
          textAlign: "left",
          paddingLeft: "0.5rem",
          paddingRight: "0.125rem",
          boxShadow: "0 0 0 0.25rem #43316b",
        },
        ".modal-button": {
          borderWidth: "2px",
          borderRadius: "0.25rem",
          borderColor: "#43316b",
          width: "50%",
          height: "2.5rem",
          lineHeight: "2.25rem",
          fontSize: "1rem",
        },
      });
    }),
    plugin(function ({ addBase }) {
      addBase({
        button: { cursor: "pointer" },
        '[role="button"]': { cursor: "pointer" },
        a: { cursor: "pointer" },
        "@media (max-width: 640px)": {
          button: { cursor: "none" },
          '[role="button"]': { cursor: "none" },
          a: { cursor: "none" },
        },
      });
    }),
  ],
};
