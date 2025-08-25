"use client";

import * as React from "react";
import MuiCheckbox, {
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export interface CheckboxProps extends MuiCheckboxProps {
  label?: React.ReactNode;
  shape?: "circle" | "rounded-square";
  radius?: number | string;
  checkedColorVar?: string;
  neutralColorVar?: string;
  focusRingVar?: string;
  hoverBgVar?: string;
}

export default function Checkbox({
  label,
  shape = "rounded-square",
  radius = 6,
  checkedColorVar = "--color-solid-basic-blue-500",
  neutralColorVar = "--color-solid-basic-neutral-400",
  focusRingVar = "--color-solid-basic-blue-300",
  hoverBgVar = "--color-solid-basic-blue-50",
  disableRipple = true,
  sx,
  ...props
}: CheckboxProps) {
  const baseBox: React.CSSProperties = {
    display: "inline-block",
    width: 20,
    height: 20,
    borderRadius: shape === "circle" ? "50%" : radius,
    border: `2px solid var(${neutralColorVar})`,
    backgroundColor: "transparent",
    transition: "all 140ms ease",
  };

  const icon = <span style={baseBox} />;
  const checkedIcon = (
    <span
      style={{
        ...baseBox,
        backgroundColor: `var(${checkedColorVar})`,
        border: `2px solid var(${checkedColorVar})`,
        position: "relative",
      }}>
      <svg
        viewBox="0 0 24 24"
        style={{
          width: 14,
          height: 14,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fill: "white",
        }}>
        <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" />
      </svg>
    </span>
  );

  const checkbox = (
    <MuiCheckbox
      disableRipple={disableRipple}
      icon={icon}
      checkedIcon={checkedIcon}
      sx={{
        padding: 2,
        "&:hover": {
          backgroundColor: `var(${hoverBgVar})`,
          borderRadius: shape === "circle" ? "50%" : radius,
        },
        "&:focus-visible": {
          outline: `2px solid var(${focusRingVar})`,
          outlineOffset: 2,
          borderRadius: shape === "circle" ? "50%" : radius,
        },
        ...sx,
      }}
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={checkbox}
        label={label}
        sx={{
          margin: 0,
          gap: "8px",
          ".MuiFormControlLabel-label": {
            fontSize: "var(--font-b2-size)",
            fontWeight: "var(--font-b2-weight, 400)",
            color: "var(--color-emphasis-light-on-surface-medium)",
          },
        }}
      />
    );
  }

  return checkbox;
}
