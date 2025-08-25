"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/mui-theme/index";
import { AlertProvider } from "@components/ui/alert";
import LayoutShell from "@components/ui/navigation-bar-atom/layout-shell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider theme={theme}>
          <AlertProvider>
            <LayoutShell>{children}</LayoutShell>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
