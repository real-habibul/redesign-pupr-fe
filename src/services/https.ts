const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api-ecatalogue-staging.online/api";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

const join = (base: string, path: string) =>
  `${base}/${String(path).replace(/^\/+/, "")}`;

type JsonPrimitive = string | number | boolean | null;
type Json = JsonPrimitive | { [k: string]: Json } | Json[];

type HttpOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  body?: Json;
  headers?: Record<string, string>;
};

export async function http<T = unknown>(
  path: string,
  opts: HttpOptions = {}
): Promise<T> {
  const { method = "GET", token, body, headers = {} } = opts;

  const res = await fetch(join(BASE_URL, path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const isJson =
    res.headers
      .get("content-type")
      ?.toLowerCase()
      .includes("application/json") ?? false;
  const data: unknown = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (isJson && data && typeof data === "object") {
      const obj = data as { message?: unknown; error?: unknown };
      if (typeof obj.message === "string") message = obj.message;
      else if (typeof obj.error === "string") message = obj.error;
    }
    throw new Error(message);
  }

  return data as T;
}
