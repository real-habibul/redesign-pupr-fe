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

export type AxiosErrorWithFriendly<T = unknown, D = unknown> = AxiosError<
  T,
  D
> & {
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
  else (headers as unknown as Record<string, string>)[key] = value;
}

function isOffline() {
  if (typeof navigator !== "undefined" && "onLine" in navigator) {
    return navigator.onLine === false;
  }
  return false;
}

type ErrorBag = Record<string, unknown>;
function firstErrorFromErrorsBag(errors: unknown): string | undefined {
  if (!errors || typeof errors !== "object") return undefined;
  const bag = errors as ErrorBag;
  const firstKey = Object.keys(bag)[0];
  const val = firstKey ? bag[firstKey] : undefined;
  if (Array.isArray(val)) {
    const first = val.find((v) => typeof v === "string");
    if (typeof first === "string") return first;
  }
  if (typeof val === "string") return val;
  return undefined;
}

function mapFriendlyMessage(axErr: AxiosErrorWithFriendly) {
  const data = axErr.response?.data as unknown;
  const msgFromErrors =
    data && typeof data === "object"
      ? firstErrorFromErrorsBag((data as Record<string, unknown>).errors)
      : undefined;
  const msgField =
    data &&
    typeof data === "object" &&
    typeof (data as Record<string, unknown>).message === "string"
      ? ((data as Record<string, unknown>).message as string)
      : undefined;
  return (
    msgFromErrors || msgField || axErr.message || "Terjadi kesalahan jaringan."
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

function toPlainParams(p?: InternalAxiosRequestConfig["params"]): unknown {
  if (!p) return undefined;
  if (p instanceof URLSearchParams) return Object.fromEntries(p.entries());
  if (typeof p === "object") return { ...(p as Record<string, unknown>) };
  return p as unknown;
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
    (headers instanceof AxiosHeaders
      ? headers.get("Content-Type")
      : undefined) ??
    (headers as unknown as Record<string, unknown>)["Content-Type"] ??
    (headers as unknown as Record<string, unknown>)["content-type"];
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
      const axErr = err as AxiosErrorWithFriendly<unknown>;
      axErr.friendlyMessage = mapFriendlyMessage(axErr);
      const autoMsg = mapAutoAlertMessage(axErr);
      if (autoMsg) emitAlert(autoMsg, "error");
      return Promise.reject(axErr);
    }
    return Promise.reject(err);
  }
);

export const api = http;
