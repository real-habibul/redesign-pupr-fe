import axios from "axios";
import { API_BASE_URL } from "@constants/endpoints";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, 
});

function setHeader(headers: unknown, key: string, value?: string) {
  if (!value) return;
  const h = headers as any;
  if (h && typeof h.set === "function") h.set(key, value);
  else h[key] = value;
}

http.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  config.headers = config.headers ?? {};
  setHeader(config.headers, "Accept", "application/json");
  if (config.data && !(config.headers as any)["Content-Type"]) {
    setHeader(config.headers, "Content-Type", "application/json");
  }
  if (token) setHeader(config.headers, "Authorization", `Bearer ${token}`);
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as any;
      const firstField = data?.errors && Object.keys(data.errors)[0];
      const firstMsg = firstField ? data.errors[firstField]?.[0] : undefined;

      (err as any).friendlyMessage =
        firstMsg ||
        data?.message ||
        err.message ||
        "Terjadi kesalahan jaringan.";
    }
    return Promise.reject(err);
  }
);
