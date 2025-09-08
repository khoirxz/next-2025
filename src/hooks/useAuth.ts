"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/client";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api<{ authenticated: boolean }>("/api/auth/me"),
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api<{ code: number; message: string; data: unknown }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export async function logout() {
  await api("/api/auth/logout", { method: "POST" });
}
