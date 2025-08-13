import "./globals.css";
import { Poppins } from "next/font/google";
import { AlertProvider } from "@components/ui/alert";
import LayoutShell from "@components/ui/navigation-bar/layout-shell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "E-Katalog SIPASTI (local)",
  description: "Your description",
  icons: { icon: "/images/login/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <AlertProvider>
          <LayoutShell>{children}</LayoutShell>
        </AlertProvider>
      </body>
    </html>
  );
}
