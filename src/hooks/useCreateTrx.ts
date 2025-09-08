"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/client";
import { type InTxnCreateResponse } from "@/types/transaction";

type CreateTrxBody = {
  wash_type: string;
  infectious_type: string;
  total_qty: number;
  details: { item_id: string }[];
};

export function useCreateTrx() {
  const qc = useQueryClient();

  return useMutation<InTxnCreateResponse, Error, CreateTrxBody>({
    mutationFn: (payload) =>
      api("/api/transactions/new", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      // refresh list yang relevan
      await qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
