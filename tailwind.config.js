/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": "#F8E9D5",
        "secondary": "#181819",
        "content": "#B5FED9",
      },
    },
    fontFamily: {
      Josefin: ["Josefin Sans", "sans-serif"],
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
