"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, system-ui, sans-serif",
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins, system-ui, sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins, system-ui, sans-serif",
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins, system-ui, sans-serif",
        },
      },
    },
  },
});

export default theme;
