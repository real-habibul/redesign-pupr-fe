import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@constants/endpoints";
import { emitAlert } from "@components/ui/alert-event";

function ensureProtocol(url: string) {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}
function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}
const BASE = stripTrailingSlash(ensureProtocol(API_BASE_URL));
function isAbsoluteUrl(url?: string) {
  return !!url && /^https?:\/\//i.test(url);
}

export type AxiosErrorWithFriendly<T = any, D = any> = AxiosError<T, D> & {
  friendlyMessage?: string;
};

export const http = axios.create({
  baseURL: BASE,
  withCredentials: false,
  timeout: 30000,
  validateStatus: (s) => s >= 200 && s < 300,
});

function setHeader(headers: unknown, key: string, value?: string) {
  if (!value) return;
  const h = headers as any;
  if (h && typeof h.set === "function") h.set(key, value);
  else h[key] = value;
}

function isOffline() {
  if (typeof navigator !== "undefined" && "onLine" in navigator) {
    return navigator.onLine === false;
  }
  return false;
}

function mapFriendlyMessage(axErr: AxiosErrorWithFriendly) {
  const data = axErr.response?.data as any | undefined;
  const firstField =
    data?.errors && typeof data.errors === "object"
      ? Object.keys(data.errors)[0]
      : undefined;
  const firstMsg =
    firstField && Array.isArray(data?.errors?.[firstField])
      ? data.errors[firstField][0]
      : undefined;

  return (
    firstMsg || data?.message || axErr.message || "Terjadi kesalahan jaringan."
  );
}

function mapAutoAlertMessage(axErr: AxiosErrorWithFriendly) {
  if (isOffline()) return "kendala jaringan";

  if (axErr.code === "ERR_NETWORK" && !axErr.response)
    return "Kendala terhubung ke API";

  if (axErr.code === "ECONNABORTED") return "Kendala terhubung ke API";

  const s = axErr.response?.status ?? 0;
  if ([502, 503, 504].includes(s)) return "Kendala terhubung ke API";

  return null;
}

http.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  config.headers = config.headers ?? {};
  setHeader(config.headers, "Accept", "application/json");

  const hasBody = !!config.data;
  const contentTypeAlreadySet =
    (config.headers as any)["Content-Type"] ||
    (config.headers as any)["content-type"];
  const isMultipart =
    typeof FormData !== "undefined" && config.data instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && config.data instanceof Blob;
  const isArrayBuffer =
    typeof ArrayBuffer !== "undefined" && config.data instanceof ArrayBuffer;

  if (
    hasBody &&
    !contentTypeAlreadySet &&
    !isMultipart &&
    !isBlob &&
    !isArrayBuffer
  ) {
    setHeader(config.headers, "Content-Type", "application/json");
  }
  if (token) setHeader(config.headers, "Authorization", `Bearer ${token}`);

  if (isAbsoluteUrl(config.url)) {
    (config as AxiosRequestConfig).baseURL = "";
  }
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const axErr = err as AxiosErrorWithFriendly<any>;

      axErr.friendlyMessage = mapFriendlyMessage(axErr);

      const autoMsg = mapAutoAlertMessage(axErr);
      if (autoMsg) emitAlert(autoMsg, "error");

      return Promise.reject(axErr);
    }
    return Promise.reject(err);
  }
);
