"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@components/ui/navigation-bar/navigation-bar";

const HIDE_NAV_ON: string[] = ["/login", "/register"];

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav = HIDE_NAV_ON.some((r) => pathname.startsWith(r));

  return (
    <>
      {!hideNav && <Navbar />}
      <main>{children}</main>
    </>
  );
}
