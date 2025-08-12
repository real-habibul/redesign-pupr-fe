// export const login = async (username: string, password: string) => {
//   const response = await fetch("https://api-ecatalogue-staging.online/api/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });
//   return await response.json();
// };

// export const fetchRole = async (token: string) => {
//   const response = await fetch("https://api-ecatalogue-staging.online/api/check-role", {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return await response.json();
// };

// export const ssoLogin = async (token: string) => {
//   const response = await fetch("https://bravo.pu.go.id/backend/ssoinformation", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ token }),
//   });
//   return await response.json();
// };

// src/services/authService.ts
import { http } from "./https";
import type { LoginResponse, RoleResponse, SsoResponse } from "../types/auth";

export async function login(email: string, password: string) {
  // sesuaikan endpoint
  return http<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function fetchRole(token: string) {
  return http<RoleResponse>("/auth/role", {
    method: "GET",
    token,
  });
}

export async function ssoLogin(ssoToken: string) {
  return http<SsoResponse>("/auth/sso", {
    method: "POST",
    body: { token: ssoToken },
  });
}
