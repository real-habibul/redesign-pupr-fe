// src/styles/fontSize.ts

const fontSize = {
  // Tailwind default
  xs: ["0.75rem", { lineHeight: "1rem" }],         // 12px
  sm: ["0.875rem", { lineHeight: "1.25rem" }],      // 14px
  base: ["1rem", { lineHeight: "1.5rem" }],         // 16px
  lg: ["1.125rem", { lineHeight: "1.75rem" }],      // 18px
  xl: ["1.25rem", { lineHeight: "1.75rem" }],       // 20px
  "2xl": ["1.5rem", { lineHeight: "2rem" }],        // 24px
  "3xl": ["1.875rem", { lineHeight: "2.25rem" }],   // 30px
  "4xl": ["2.25rem", { lineHeight: "2.5rem" }],     // 36px
  "5xl": ["3rem", { lineHeight: "1" }],             // 48px
  "6xl": ["3.75rem", { lineHeight: "1" }],          // 60px
  "7xl": ["4.5rem", { lineHeight: "1" }],           // 72px
  "8xl": ["6rem", { lineHeight: "1" }],             // 96px
  "9xl": ["8rem", { lineHeight: "1" }],             // 128px

  // Custom Headline Styles
  H1: ["3.5rem", { lineHeight: "4rem", fontWeight: "700" }],       // 56px
  H2: ["3rem", { lineHeight: "3.5rem", fontWeight: "700" }],       // 48px
  H3: ["2.5rem", { lineHeight: "3rem", fontWeight: "700" }],       // 40px
  H4: ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],       // 32px
  H5: ["1.5rem", { lineHeight: "2rem", fontWeight: "800" }],       // 24px
  H6: ["1rem", { lineHeight: "1.5rem", fontWeight: "700" }],       // 16px

  // Custom Body Styles
  B1: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],       // 16px
  B2: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],  // 14px

  // Custom Button Styles
  ExtraLarge: ["1.5rem", { lineHeight: "2rem", fontWeight: "400" }],     // 24px
  Large: ["1.313rem", { lineHeight: "1.75rem", fontWeight: "400" }],     // 21px
  Medium: ["1.125rem", { lineHeight: "1.75rem", fontWeight: "400" }],    // 18px
  Small: ["0.938rem", { lineHeight: "1.25rem", fontWeight: "400" }],     // 15px
  ExtraSmall: ["0.75rem", { lineHeight: "1rem", fontWeight: "400" }],   // 12px

  // Custom Other Styles
  Caption: [
    "0.75rem",
    {
      lineHeight: "1.25rem",
      fontWeight: "400",
      letterSpacing: "0.025em",
    },
  ],
  Overline: [
    "0.625rem",
    {
      lineHeight: "1.125rem",
      fontWeight: "400",
      letterSpacing: "0.094em",
    },
  ],
};

export default fontSize;
