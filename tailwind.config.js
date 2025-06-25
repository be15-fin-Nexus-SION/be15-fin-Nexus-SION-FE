/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  safelist: [
    "bg-grade-s",
    "bg-grade-a",
    "bg-grade-b",
    "bg-grade-c",
    "bg-grade-d",
    "bg-grade-default",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6574F6",
          hover: "#586DDD",
        },
        secondary: {
          blue: {
            DEFAULT: "#CBEEFF",
            hover: "#A9C6E0",
          },
          green: {
            DEFAULT: "#00C1BD",
            hover: "#03A67A",
          },
        },
        natural: {
          light: {
            DEFAULT: "#EBEAFF",
            hover: "#BEC0D7",
          },
          gray: {
            DEFAULT: "#E0E0E0",
            hover: "#CCC9C9",
          },
        },
        semantic: {
          success: "#A1FFAA",
          warning: "#EC4D4D",
          wait: "#FFD344",
        },
        support: {
          stack: "#555555",
          stack_dark: "#808080",
        },
        status: {
          waiting: "#FFD344",
          projecting: "#64CF8B",
        },
      },
      backgroundImage: {
        "gradient-card": "linear-gradient(90deg, #FE8686 0%, #1268DD 100%)",
        "gradient-ai": "linear-gradient(90deg, #7F5AF0 0%, #00C3FF 100%)",
        "gradient-arrangement":
          "linear-gradient(90deg, #FE8686 0%, #1E268D 100%)",
        "gradient-grade-s": "linear-gradient(90deg, #FF8C00 0%, #992E00 100%)",
        "gradient-grade-a": "linear-gradient(90deg, #FF000D 0%, #990000 100%)",
        "gradient-grade-b": "linear-gradient(90deg, #00FFA6 0%, #009966 100%)",
        "gradient-grade-c": "linear-gradient(90deg, #FFE500 0%, #999600 100%)",
        "gradient-grade-d": "linear-gradient(90deg, #BDBDBD 0%, #606060 100%)",
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
