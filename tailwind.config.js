const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pry: "#2A3A23",
        ter: "#9CDD85",
        yellowPry: "#FFDE6B",
        yellowSec: "#B07C3A",
        brownPry: "#462B11",
        brownSec: "#7D5A2F",
        sec: "#519527",
        black: "#1F1F1F",
        redPry: "#E94646",
      },
      //added SF-regular
      fontFamily: {
        sans: ["SF-regular", "sans-serif"],
      },
    },
  },
  plugins: [],
});
