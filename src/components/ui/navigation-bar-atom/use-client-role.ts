"use client";
import { useEffect, useState } from "react";
import type { Role } from "../../../types/navigation-bar/nav";

export function useClientRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const r = (localStorage.getItem("role") as Role) ?? null;
    const u = localStorage.getItem("username");
    setRole(r); setUsername(u);
  }, []);

  return { role, username };
}
