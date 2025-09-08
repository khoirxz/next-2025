// src/types/transactions.ts
import { z } from "zod";
import {
  InfectiousType,
  ResponseEnvelope,
  ResponseEnvelopeWithPage,
  WashType,
} from "./api.common";

// ---------- CREATE ----------
export const InTxnCreateBodySchema = z.object({
  code: z.string().optional().default(""),
  transaction_date: z.string().optional().default(""),
  wash_type: WashType,
  infectious_type: InfectiousType,
  total_weight: z.number().nonnegative(),
  total_weight_scales: z.number().nonnegative(),
  total_qty: z.number().int().positive(),
  corporate_id: z.string().optional().default(""),
  details: z.array(z.object({ item_id: z.string().min(1) })).min(1),
});
export type InTxnCreateBody = z.infer<typeof InTxnCreateBodySchema>;

export const InTxnCreateDataSchema = z.object({
  in_transaction_id: z.string(),
  code: z.string(),
  transaction_date: z.string(),
  total_qty: z.number().int(),
  wash_type: WashType,
  infectious_type: InfectiousType,
  total_weight: z.number(),
  total_weight_scales: z.number(),
  status: z.string(), // "PENDING" dll.
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string(),
  updated_by: z.string(),
  corporate_id: z.string(),
  deleted: z.union([z.string(), z.boolean()]),
});
export const InTxnCreateResponseSchema = ResponseEnvelope(
  InTxnCreateDataSchema
);
export type InTxnCreateResponse = z.infer<typeof InTxnCreateResponseSchema>;

// ---------- LIST ----------
export const InTxnRowSchema = z.object({
  in_transaction_id: z.string(),
  code: z.string(),
  transaction_date: z.string(),
  total_qty: z.number().int(),
  wash_type: WashType,
  infectious_type: InfectiousType,
  total_weight: z.number(),
  total_weight_scales: z.number(),
  status: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string(),
  updated_by: z.string(),
  corporate_id: z.string(),
  deleted: z.union([z.string(), z.boolean()]),
  corporates: z.object({
    corporate_id: z.string(),
    code: z.string(),
    name: z.string(),
  }),
});
export const InTxnListResponseSchema = ResponseEnvelopeWithPage(
  z.array(InTxnRowSchema)
);
export type InTxnRow = z.infer<typeof InTxnRowSchema>;
export type InTxnListResponse = z.infer<typeof InTxnListResponseSchema>;
