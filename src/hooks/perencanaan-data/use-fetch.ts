"use client";
import { useEffect, useState } from "react";

type UseFetchState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export function useFetch<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const result = await fn();
        if (!alive) return;
        setState({ data: result, error: null, loading: false });
      } catch (err: unknown) {
        if (!alive) return;
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setState({ data: null, error: message, loading: false });
      }
    })();

    return () => {
      alive = false;
    };
  }, [fn]);

  return state;
}
