const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api-ecatalogue-staging.online/api/";

type HttpOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function http<T = any>(path: string, opts: HttpOptions = {}): Promise<T> {
  const { method = "GET", token, body, headers = {} } = opts;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : (await res.text());

  if (!res.ok) {
    const message =
      (isJson && (data?.message || data?.error)) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}
