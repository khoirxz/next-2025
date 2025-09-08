// src/types/itemTypes.ts
import { z } from "zod";
import { MedicalType, ResponseEnvelopeWithPage } from "./api.common";

export const ItemTypeSchema = z.object({
  item_type_id: z.string(),
  name: z.string(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  weight: z.number().nullable().optional(),
  medical_type: MedicalType,
  specs: z.string().nullable().optional(),
  corporate_id: z.string().nullable().optional(),
  created_at: z.string(), // ISO
  created_by: z.string(),
  updated_at: z.string(),
  updated_by: z.string(),
  deleted: z.union([z.string(), z.boolean()]).optional(),
  corporates: z
    .object({
      corporate_id: z.string(),
      name: z.string(),
      code: z.string(),
    })
    .optional(),
});

export const ItemTypeListSchema = ResponseEnvelopeWithPage(
  z.array(ItemTypeSchema)
);
export type ItemType = z.infer<typeof ItemTypeSchema>;
export type ItemTypeListResponse = z.infer<typeof ItemTypeListSchema>;

// Query params validator (q, page, limit)
export { PagingQuerySchema as ItemTypeQuerySchema } from "./api.common";
