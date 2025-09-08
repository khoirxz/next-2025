// src/lib/apiClient.ts
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_UPSTREAM!;

export async function apiFetch<T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      Authorization:
        typeof window !== "undefined" && localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : "",
    },
  });

  // 401 guard sederhana
  if (res.status === 401) {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    throw new Error("UNAUTHORIZED");
  }

  const json = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // console.error(parsed.error);
    throw new Error("Invalid API response");
  }
  return parsed.data;
}
