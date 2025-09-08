"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { ItemTypeListResponse } from "@/types/itemTypes";

export function useItemTypes(params: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const { q = "", page = 1, limit = 10 } = params;
  return useQuery<ItemTypeListResponse>({
    queryKey: ["item-types", { q, page, limit }],
    queryFn: () =>
      api(
        `/api/item-types?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
      ),
  });
}
