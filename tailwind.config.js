import colors from "./src/styles/colors";
const fontSize = require("./src/styles/font-size");
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customtest: "#ff00ff",
        testcolor: "#ff00ff",
      },
      fontSize: {
        test: "69px",
        surface: {
          light: {
            background: colors.Surface.Light.Background,
            overlay: colors.Surface.Light.Background_Overlay,
            outline: colors.Surface.Light.Outline,
          },
        },
        emphasis: {
          on_surface: {
            high: colors.Emphasis.Light.On_Surface.High,
            medium: colors.Emphasis.Light.On_Surface.Medium,
            small: colors.Emphasis.Light.On_Surface.Small,
          },
          on_color: {
            high: colors.Emphasis.Light.On_Color.High,
            medium: colors.Emphasis.Light.On_Color.Medium,
            small: colors.Emphasis.Light.On_Color.Small,
          },
        },
        solid: colors.Solid,
        custom: {
          red: colors.Solid.Basic.Red,
          blue: colors.Solid.Basic.Blue,
          neutral: colors.Solid.Basic.Neutral,
          green: colors.Solid.Basic.Green,
          yellow: colors.Solid.Basic.Yellow,
          error: colors.Solid.Basic.Error,
        },
      },
      fontSize,
    },
    fontFamily: {
      sans: ["Poppins", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};
