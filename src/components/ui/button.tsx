// @components/button.tsx
import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";
import "@fontsource/poppins";

type CustomVariant =
  | "solid_blue"
  | "outlined_yellow"
  | "text_red"
  | "text_blue";

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "sx"> {
  variant?: CustomVariant;
  label?: string;
  sx?: SxProps<Theme>;
}

const baseStyle: SxProps<Theme> = {
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
  "&:hover": { transform: "scale(1.03)", boxShadow: "none" },
  "&:active": { transform: "scale(0.99)" },
  "&.Mui-disabled": {
    opacity: 1,
    backgroundColor: "#D1D5DB",
    color: "#6B7280",
    boxShadow: "none",
    transform: "none",
  },
};

function variantStyle(variant: CustomVariant): SxProps<Theme> {
  switch (variant) {
    case "solid_blue":
      return {
        backgroundColor: "var(--color-solid-basic-blue-500)",
        color: "var(--color-emphasis-light-on-color-high)",
        "&:hover": { backgroundColor: "var(--color-solid-basic-blue-400)" },
        "&:active": { backgroundColor: "var(--color-solid-basic-blue-600)" },
      };
    case "outlined_yellow":
      return {
        backgroundColor: "transparent",
        color: "var(--color-solid-basic-yellow-600, #B45309)",
        borderWidth: "1.5px",
        borderStyle: "solid",
        borderColor: "var(--color-solid-basic-yellow-500, #F59E0B)",
        "&:hover": {
          backgroundColor: "rgba(245, 158, 11, 0.08)",
          borderColor: "var(--color-solid-basic-yellow-600, #D97706)",
        },
        "&:active": { backgroundColor: "rgba(245, 158, 11, 0.14)" },
      };
    case "text_red":
      return {
        backgroundColor: "transparent",
        color: "var(--color-solid-basic-red-500, #EF4444)",
        padding: 0,
        minWidth: 0,
        height: "32px",
        "&:hover": { textDecoration: "underline" },
      };
    case "text_blue":
      return {
        backgroundColor: "transparent",
        color: "var(--color-solid-basic-blue-500)",
        padding: 0,
        minWidth: 0,
        height: "32px",
        "&:hover": { textDecoration: "underline" },
      };
    default:
      return {};
  }
}

export default function Button({
  variant = "solid_blue",
  label,
  sx,
  fullWidth = true,
  ...props
}: ButtonProps) {
  const composedSx: SxProps<Theme> = [
    baseStyle,
    variantStyle(variant),
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ];

  return (
    <MuiButton
      fullWidth={fullWidth}
      disableElevation
      sx={composedSx}
      {...props}>
      {label ?? props.children}
    </MuiButton>
  );
}
