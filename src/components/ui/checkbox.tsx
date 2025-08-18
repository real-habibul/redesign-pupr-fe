"use client";

import * as React from "react";
import MuiCheckbox, {
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";

export interface CheckboxProps extends MuiCheckboxProps {
  shape?: "circle" | "rounded-square";
  radius?: number | string;

  checkedColorVar?: string;

  neutralColorVar?: string;

  focusRingVar?: string;

  hoverBgVar?: string;

  hoverScale?: number;
  checkedScale?: number;
}

export default function Checkbox({
  shape = "circle",
  radius = 16,
  checkedColorVar = "--color-solid-basic-blue-500",
  neutralColorVar = "--color-solid-basic-neutral-400",
  focusRingVar = "--color-solid-basic-blue-300",
  hoverBgVar = "--color-solid-basic-blue-50",
  hoverScale = 1.06,
  checkedScale = 1.08,
  sx,
  disableRipple = true,
  ...props
}: CheckboxProps) {
  return (
    <MuiCheckbox
      disableRipple={disableRipple}
      sx={{
        "@keyframes checkbox-pop": {
          "0%": { transform: "scale(1)" },
          "60%": { transform: `scale(${checkedScale})` },
          "100%": { transform: "scale(1)" },
        },

        "& .MuiSvgIcon-root": {
          fontSize: 22,
          borderRadius: shape === "circle" ? "50%" : radius,
          transition:
            "transform 140ms ease, color 140ms ease, box-shadow 140ms ease, background-color 140ms ease",
          color: `var(${neutralColorVar})`,
          backgroundColor: "transparent",
        },

        "&:hover .MuiSvgIcon-root": {
          transform: `scale(${hoverScale})`,
          backgroundColor: `var(${hoverBgVar})`,
        },

        "&.Mui-checked .MuiSvgIcon-root, &.MuiCheckbox-indeterminate .MuiSvgIcon-root":
          {
            color: `var(${checkedColorVar})`,
            animation: "checkbox-pop 150ms ease-out",
            boxShadow: `0 0 0 6px color-mix(in oklab, var(${hoverBgVar}) 70%, transparent)`,
          },

        "&:focus-visible": {
          outline: `2px solid var(${focusRingVar})`,
          outlineOffset: 2,
          borderRadius: shape === "circle" ? "50%" : radius,
        },

        "&.Mui-checked:hover .MuiSvgIcon-root, &.MuiCheckbox-indeterminate:hover .MuiSvgIcon-root":
          {
            backgroundColor: `var(${hoverBgVar})`,
          },

        ...sx,
      }}
      {...props}
    />
  );
}
