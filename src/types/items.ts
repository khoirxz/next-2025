// src/types/items.ts
import { z } from "zod";
import {
  DeletedAny,
  ItemStatus,
  MedicalType,
  ResponseEnvelope,
  ResponseEnvelopeWithPage,
} from "./api.common";

// ---------- CREATE (batch) ----------
export const ItemBatchCreateBodySchema = z.object({
  item_type_id: z.string(),
  room_id: z.string(),
  procurement_date: z.string(), // ISO string
  total_qty: z.number().int().min(1),
  details: z
    .array(
      z.object({
        item_id: z.string().min(1),
      })
    )
    .min(1),
});
export type ItemBatchCreateBody = z.infer<typeof ItemBatchCreateBodySchema>;

export const ItemBatchCreateResponseSchema = ResponseEnvelope(
  z.object({ count: z.number().int() })
);
export type ItemBatchCreateResponse = z.infer<
  typeof ItemBatchCreateResponseSchema
>;

// end of CREATE (batch) ----------

// ---------- LIST ----------
export const ItemEmbeddedTypeSchema = z.object({
  item_type_id: z.string(),
  name: z.string(),
  medical_type: MedicalType,
});

export const ItemEmbeddedRoomSchema = z.object({
  room_id: z.string(),
  name: z.string(),
});

export const ItemEmbeddedCorporateSchema = z.object({
  corporate_id: z.string(),
  name: z.string(),
  code: z.string(),
});

export const ItemRowSchema = z.object({
  item_id: z.string(),
  item_type_id: z.string(),
  room_id: z.string(),
  status: ItemStatus,
  corporate_id: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string(),
  updated_by: z.string(),
  last_status: ItemStatus.or(z.string()), // kalau server kirim string apapun
  wash_count: z.number().int(),
  deleted: DeletedAny,
  vendor_id: z.string().nullable(),
  procurement_date: z.string().nullable(),
  description: z.string().nullable(),
  reff_id: z.string().nullable(),
  item_types: ItemEmbeddedTypeSchema,
  rooms: ItemEmbeddedRoomSchema,
  corporates: ItemEmbeddedCorporateSchema,
  vendors: z.any().nullable(), // belum ada detail struktur
});

export const ItemListSchema = ResponseEnvelopeWithPage(z.array(ItemRowSchema));
export type ItemRow = z.infer<typeof ItemRowSchema>;
export type ItemListResponse = z.infer<typeof ItemListSchema>;

// Query params untuk list items
export const ItemListQuerySchema = z.object({
  q: z.string().optional(),
  room_id: z.string().optional(),
  item_type_id: z.string().optional(),
  status: ItemStatus.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type ItemListQuery = z.infer<typeof ItemListQuerySchema>;

// end of LIST ----------

// ---------- DETAIL ----------
export const ItemDetailSchema = ItemRowSchema; // struktur sama dengan row list di contoh
export const ItemDetailResponseSchema = ResponseEnvelope(ItemDetailSchema);
export type ItemDetail = z.infer<typeof ItemDetailSchema>;
export type ItemDetailResponse = z.infer<typeof ItemDetailResponseSchema>;

// end of DETAIL ----------

// ---------- UPDATE ----------
export const ItemUpdateBodySchema = z.object({
  item_type_id: z.string(),
  room_id: z.string(),
  corporate_id: z.string().optional().nullable(),
});
export type ItemUpdateBody = z.infer<typeof ItemUpdateBodySchema>;

export const ItemUpdateResponseSchema = ResponseEnvelope(
  z.object({
    item_id: z.string(),
    item_type_id: z.string(),
    room_id: z.string(),
    status: z.string(), // contoh: "USED"
    corporate_id: z.string(),
    created_at: z.string(),
    created_by: z.string(),
    updated_at: z.string(),
    updated_by: z.string(),
    last_status: z.string(),
    wash_count: z.number().int(),
    deleted: z.union([z.string(), z.boolean()]),
    corporates: ItemEmbeddedCorporateSchema,
    rooms: ItemEmbeddedRoomSchema,
    item_types: z.object({
      item_type_id: z.string(),
      name: z.string(),
      medical_type: MedicalType,
    }),
  })
);
export type ItemUpdateResponse = z.infer<typeof ItemUpdateResponseSchema>;

// end of UPDATE ----------
