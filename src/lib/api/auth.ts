import { http } from "./https";
import type { LoginPayload, SsoPayload, AuthResponse } from "../../types/auth";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await http.post<any>("/login", {
    username: payload.email,
    password: payload.password,
  });

  const raw = data || {};
  const success =
    raw.success ??
    (typeof raw.status === "string"
      ? raw.status === "success"
      : !!raw.status) ??
    !!raw.data?.accessToken ??
    !!raw.access_token ??
    !!raw.token;

  const accessToken =
    raw.data?.accessToken ?? raw.access_token ?? raw.token ?? undefined;

  const user = raw.data?.user ?? raw.user ?? undefined;

  const message = raw.message ?? (success ? "Login berhasil!" : "Login gagal.");

  return {
    success,
    message,
    data: {
      accessToken,
      user,
    },
  };
}

export async function ssoLogin(payload: SsoPayload): Promise<AuthResponse> {
  const { data } = await http.post<any>("/sso", { token: payload.token });
  const raw = data || {};
  const success =
    raw.success ??
    (typeof raw.status === "string"
      ? raw.status === "success"
      : !!raw.status) ??
    !!raw.data?.accessToken ??
    !!raw.access_token ??
    !!raw.token;

  const accessToken =
    raw.data?.accessToken ?? raw.access_token ?? raw.token ?? undefined;

  const user = raw.data?.user ?? raw.user ?? undefined;

  const message =
    raw.message ?? (success ? "Login SSO berhasil!" : "Login SSO gagal.");

  return {
    success,
    message,
    data: { accessToken, user },
  };
}
