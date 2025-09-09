// src/hooks/useAuth.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: async () => {
      // drop all cached protected data
      qc.clear();
      // hard-redirect to login (fresh session)
      window.location.href = "/login";
    },
  });
}
