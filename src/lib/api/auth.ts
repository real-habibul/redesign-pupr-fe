import { http } from "./https";
import type {
  LoginPayload,
  SsoPayload,
  AuthResponse,
  User,
} from "../../types/auth";

type AuthServerPayload = {
  success?: boolean;
  status?: string | boolean;
  message?: string;
  data?: {
    accessToken?: string;
    user?: unknown;
  } | null;
  access_token?: string;
  token?: string;
  user?: unknown;
};

function buildAuthResponse(
  raw: AuthServerPayload,
  okMsg: string,
  errMsg: string
): AuthResponse {
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

  const user = (raw.data?.user ?? raw.user) as User | undefined;

  const message = raw.message ?? (success ? okMsg : errMsg);

  return {
    success,
    message,
    data: { accessToken, user },
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await http.post<AuthServerPayload>("/login", {
    username: payload.email,
    password: payload.password,
  });
  return buildAuthResponse(data ?? {}, "Login berhasil!", "Login gagal.");
}

export async function ssoLogin(payload: SsoPayload): Promise<AuthResponse> {
  const { data } = await http.post<AuthServerPayload>("/sso", {
    token: payload.token,
  });
  return buildAuthResponse(
    data ?? {},
    "Login SSO berhasil!",
    "Login SSO gagal."
  );
}
