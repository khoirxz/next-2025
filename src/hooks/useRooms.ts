"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { RoomListResponse } from "@/types/rooms";

export function useRooms(params: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const { q = "", page = 1, limit = 10 } = params;
  return useQuery<RoomListResponse>({
    queryKey: ["rooms", { q, page, limit }],
    queryFn: () =>
      api(`/api/rooms?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),
  });
}
