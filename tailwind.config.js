/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      colors: {
        // 🎨 Primary 색상 팔레트
        primary: {
          50: "#EBEDF7",
          100: "#E1E4F2",
          200: "#C2C7E5",
          300: "#3949AB",
          400: "#33429A",
          500: "#2E3A89",
          600: "#2B3780",
          700: "#222C67",
          800: "#1A214D",
          900: "#141A3C",
        },
        grayText: "#8E98A8", // 헥스/ RGB 설명용 색
      },

      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        full: "9999px",
      },

      boxShadow: {
        none: "none",
        base: "0px 1px 3px rgba(0, 0, 0, 0.10)",
        hover: "0px 1px 6px rgba(0, 0, 0, 0.15)",
        elevated: "0px 8px 16px rgba(0, 0, 0, 0.20)",
      },

      fontSize: {
        displayXL: [
          "64px",
          {
            lineHeight: "77.5px",
            letterSpacing: "-0.048em",
            fontWeight: "600",
          },
        ],
        displayLg: [
          "52px",
          {
            lineHeight: "62.9px",
            letterSpacing: "-0.037em",
            fontWeight: "600",
          },
        ],
        displayMd: [
          "44px",
          {
            lineHeight: "53.2px",
            letterSpacing: "-0.037em",
            fontWeight: "600",
          },
        ],
        displaySm: [
          "34px",
          {
            lineHeight: "41.1px",
            letterSpacing: "-0.037em",
            fontWeight: "600",
          },
        ],
        headlineLg: [
          "30px",
          { lineHeight: "36.3px", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        headlineMd: [
          "26px",
          { lineHeight: "31.5px", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        headlineSm: [
          "22px",
          { lineHeight: "26.8px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        bodyLg: [
          "18px",
          { lineHeight: "21.8px", letterSpacing: "0em", fontWeight: "400" },
        ],
        bodyMd: [
          "16px",
          { lineHeight: "19.4px", letterSpacing: "0em", fontWeight: "400" },
        ],
        bodySm: [
          "14px",
          { lineHeight: "16.9px", letterSpacing: "0em", fontWeight: "400" },
        ],
        caption: [
          "12px",
          { lineHeight: "14.5px", letterSpacing: "0em", fontWeight: "400" },
        ],
      },
    },
  },
  plugins: [],
};
