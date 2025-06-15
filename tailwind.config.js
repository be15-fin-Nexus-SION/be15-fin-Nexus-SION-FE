/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['"Pretendard"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
