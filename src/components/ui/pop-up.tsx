"use client";
import * as React from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";

interface BasePopupProps {
  id?: string;
  open: boolean;
  anchor: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BasePopup({
  id,
  open,
  anchor,
  onClose,
  children,
}: BasePopupProps) {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
        },
      }}>
      <Box>{children}</Box>
    </Popover>
  );
}
