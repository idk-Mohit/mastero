import { useState } from "react";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: any;
  headers?: HeadersInit;
}

export function useFetch<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = async ({
    url,
    method = "GET",
    body = null,
    headers = { "Content-Type": "application/json" },
  }: FetchOptions) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        method,
        headers,
        credentials: "include",
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const result = await res.json();

      setData(result.data ?? result);
      return result ?? result;
    } catch (err: any) {
      setError(err?.message || "Fetch failed");
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetch: execute };
}
