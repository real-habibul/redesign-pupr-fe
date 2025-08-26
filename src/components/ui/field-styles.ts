// @components/ui/field-styles.ts
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

export const fieldBaseSx: SystemStyleObject<Theme> = {
  height: "48px",
  borderRadius: "16px",
  fontFamily: "Poppins, sans-serif !important",
  textTransform: "none",
  boxShadow: "none",
  transition:
    "transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
  animation: "fadeIn 0.6s ease-in-out",
  animationDelay: "0.1s",
  animationFillMode: "both",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },

  "& .MuiOutlinedInput-root": {
    height: "48px",
    borderRadius: "16px",
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px",
      display: "flex",
      alignItems: "center",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-surface-light-outline, #D0D5DD)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-solid-basic-blue-500)",
      borderWidth: "1.5px",
    },
  },

  "&.Mui-disabled, & .Mui-disabled": {
    opacity: 1,
    backgroundColor: "#D1D5DB",
    color: "#6B7280",
    boxShadow: "none",
    transform: "none",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
  },
};
