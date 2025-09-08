"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { qk } from "@/lib/queryKeys";
import { ItemDetailResponse } from "@/types/items";

export function useItemTypes(params: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const { q, page = 1, limit = 10 } = params;
  return useQuery({
    queryKey: qk.itemTypes(q, page, limit),
    queryFn: () =>
      api(`/api/item-types?q=${q ?? ""}&page=${page}&limit=${limit}`),
  });
}

export function useRooms(params: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const { q, page = 1, limit = 10 } = params;
  return useQuery({
    queryKey: qk.rooms(q, page, limit),
    queryFn: () => api(`/api/rooms?q=${q ?? ""}&page=${page}&limit=${limit}`),
  });
}

export function useItems(params: {
  q?: string;
  room_id?: string;
  item_type_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: qk.items(params),
    queryFn: () => {
      const usp = new URLSearchParams();
      Object.entries(params).forEach(
        ([k, v]) => v != null && v !== "" && usp.set(k, String(v))
      );
      return api(`/api/items?${usp.toString()}`);
    },
  });
}

export function useItemDetail(id: string) {
  return useQuery({
    queryKey: qk.item(id),
    queryFn: () => api(`/api/items/${id}`),
    staleTime: 60_000,
  });
}

// Contoh update item (optimistic)
export function useUpdateItem(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      item_type_id: string;
      room_id: string;
      corporate_id?: string;
    }) =>
      api(`/api/items/${id}/update`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: qk.item(id) });
      const prev = qc.getQueryData<ItemDetailResponse>(qk.item(id));
      qc.setQueryData<ItemDetailResponse>(
        qk.item(id),
        (old: ItemDetailResponse) =>
          old
            ? {
                ...old,
                item_type_id: vars.item_type_id,
                room_id: vars.room_id,
                corporate_id: vars.corporate_id,
              }
            : old
      );
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.item(id), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.item(id) });
      qc.invalidateQueries({ queryKey: ["items"] }); // list refresh
    },
  });
}
