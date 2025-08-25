import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
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

function setHeader(
  headers: AxiosRequestHeaders | AxiosHeaders,
  key: string,
  value?: string
) {
  if (!value) return;
  if (headers instanceof AxiosHeaders) headers.set(key, value);
  else (headers as any)[key] = value;
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

function toPlainParams(p?: InternalAxiosRequestConfig["params"]) {
  if (!p) return undefined;
  if (p instanceof URLSearchParams) return Object.fromEntries(p.entries());
  if (typeof p === "object") return { ...(p as any) };
  return p as any;
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers || {});
  setHeader(headers, "Accept", "application/json");

  const hasBody = !!config.data;
  const contentTypeAlreadySet =
    headers.get?.("Content-Type") ||
    (headers as any)["Content-Type"] ||
    (headers as any)["content-type"];
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
    setHeader(headers, "Content-Type", "application/json");
  }
  if (token) setHeader(headers, "Authorization", `Bearer ${token}`);

  const plainParams = toPlainParams(config.params);
  const overrideBaseURL = isAbsoluteUrl(config.url) ? "" : config.baseURL;

  const next: InternalAxiosRequestConfig = {
    ...config,
    headers,
    params: plainParams,
    baseURL: overrideBaseURL,
  } as InternalAxiosRequestConfig;

  return next;
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

export const api = http;
