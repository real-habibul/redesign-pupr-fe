import type { Config } from "tailwindcss";
import colors from "./src/styles/colors";
import fontSize from "./src/styles/font-size";
import defaultTheme from "tailwindcss/defaultTheme";


const config: Config = {
content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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

export default config;
