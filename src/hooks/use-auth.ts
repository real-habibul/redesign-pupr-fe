"use client";
import { useCallback } from "react";
import { login, ssoLogin } from "@lib/api/auth";

export function useAuthActions() {
  const doLogin = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Email dan kata sandi wajib diisi.");
    }
    const res = await login({ email, password });
    if (!res.success) throw new Error(res.message || "Login gagal.");
    // simpan token kalau ada
    if (res.data?.accessToken) localStorage.setItem("accessToken", res.data.accessToken);
    return res;
  }, []);

  const doSsoLogin = useCallback(async (token: string) => {
    const res = await ssoLogin({ token });
    if (!res.success) throw new Error(res.message || "Login SSO gagal.");
    return res;
  }, []);

  return { doLogin, doSsoLogin };
}
