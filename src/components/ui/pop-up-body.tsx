import * as React from "react";
import { Typography } from "@mui/material";

export default function PopupBody({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="body2"
      sx={{ fontFamily: "Poppins, sans-serif", color: "#0A0A0A" }}>
      {children}
    </Typography>
  );
}
