"use client";
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "@fontsource/poppins";

type Sev = "success" | "error" | "info" | "warning";
type ShowFn = (msg: string, sev?: Sev) => void;

const AlertCtx = React.createContext<{ show: ShowFn } | null>(null);

export function useAlert() {
  const ctx = React.useContext(AlertCtx);
  if (!ctx) throw new Error("useAlert must be used within <AlertProvider>");
  return ctx;
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState<Sev>("info");

  const show: ShowFn = (msg, sev = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <AlertCtx.Provider value={{ show }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          sx={{
            "&, & *": { fontFamily: "Poppins, sans-serif !important" },
            borderRadius: "16px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
            px: 2,
            py: 1.5,

            "&.MuiAlert-filledSuccess": {
              backgroundColor: "var(--color-solid-basic-green-100, #DCFCE7)",
              color: "var(--color-solid-basic-green-700, #047857)",
              fontWeight: 600,
              "& .MuiAlert-icon": {
                color: "var(--color-solid-basic-green-700, #047857)",
              },
            },
            "&.MuiAlert-filledError": {
              backgroundColor: "var(--color-solid-basic-red-100, #FEE2E2)",
              color: "var(--color-solid-basic-red-500, #EF4444)",
            },
            "&.MuiAlert-filledInfo": {
              backgroundColor: "var(--color-solid-basic-blue-100, #DBEAFE)",
              color: "var(--color-solid-basic-blue-500, #3B82F6)",
            },
            "&.MuiAlert-filledWarning": {
              backgroundColor: "var(--color-solid-basic-yellow-100, #FEF9C3)",
              color: "var(--color-solid-basic-yellow-500, #F59E0B)",
            },
          }}>
          {message}
        </Alert>
      </Snackbar>
    </AlertCtx.Provider>
  );
}
