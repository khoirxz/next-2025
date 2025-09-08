"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { InTxnListResponse } from "@/types/transaction";

export function useTransactions(params: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const { q = "", page = 1, limit = 10 } = params;
  return useQuery<InTxnListResponse>({
    queryKey: ["transactions", { q, page, limit }],
    queryFn: () =>
      api(
        `/api/transactions?q=${encodeURIComponent(
          q
        )}&page=${page}&limit=${limit}`
      ),
  });
}
