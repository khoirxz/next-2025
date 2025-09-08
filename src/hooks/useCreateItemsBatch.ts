"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/client";
import {
  ItemBatchCreateResponseSchema,
  type ItemBatchCreateResponse,
} from "@/types/items";

type CreateItemsPayload = {
  item_type_id: string;
  room_id: string;
  procurement_date: string; // ISO
  total_qty: number;
  details: { item_id: string }[];
};

export function useCreateItemBatch() {
  const qc = useQueryClient();

  return useMutation<ItemBatchCreateResponse, Error, CreateItemsPayload>({
    mutationFn: (payload) =>
      api("/api/items/batch-create", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      // refresh list yang relevan
      await qc.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
