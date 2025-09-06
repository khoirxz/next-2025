import { z } from "zod";

/**
 *
 * Shared primitive validators
 */

export const IdSchema = z.string().min(1, "ID wajib diisi");

export const PageInfoSchema = z.object({
  page: z.number().int().nonnegative(),
  total_data: z.number().int().nonnegative(),
  total_page: z.number().int().nonnegative(),
});

export const CorporateSchema = z.object({
  corporate_id: IdSchema,
  name: z.string().min(1, "Nama wajib diisi"),
  code: z.string().min(1, "Kode wajib diisi"),
});

// ItemType & Room
export const ItemTypeSchema = z.object({
  item_type_id: IdSchema,
  name: z.string().min(1),
  size: z.string().optional().default(""),
  color: z.string().optional().default(""),
  weight: z
    .number()
    .or(z.string().transform((v) => Number(v)))
    .refine((n) => !Number.isNaN(n), "weight harus angka"),
  medical_type: z.enum(["MEDICAL", "NON_MEDICAL"]).catch("MEDICAL"),
  specs: z.string().optional().default(""),
  corporate_id: IdSchema,
  created_at: z.string().optional(),
  created_by: z.string().optional(),
  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
  deleted: z.enum(["YES", "NO"]).catch("NO"),
  corporates: CorporateSchema,
});

export const RoomSchema = z.object({
  room_id: IdSchema,
  name: z.string().min(1),
  code: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]).catch("ACTIVE"),
  corporates: CorporateSchema,
});

/**
 * List response helpers (konkret; zod tidak generik runtime)
 */
export const ItemTypeListResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  requestId: z.string(),
  data: z.array(ItemTypeSchema),
  pageInfo: PageInfoSchema,
});

export const RoomListResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  requestId: z.string(),
  data: z.array(RoomSchema),
  pageInfo: PageInfoSchema,
});

/**
 * Dynamic Attribute (client-side) untuk form builder
 * type dipakai hanya di UI; server menerima { key, value }
 */
export const DynamicFieldTypeSchema = z.enum([
  "text",
  "number",
  "select",
  "date",
  "multivalue",
]);

export const ClientAttributeSchema = z.object({
  key: z.string().min(1, "Nama field wajib"),
  type: DynamicFieldTypeSchema.default("text"),
  value: z
    .union([z.string(), z.number(), z.array(z.string())])
    .or(z.string().array()),
});

// Payload server: { key, value } (value: string | number | string[])
export const ServerAttributeSchema = z.object({
  key: z.string().min(1),
  value: z.union([z.string(), z.number(), z.array(z.string())]),
});

/**
 * Item Create & Transaction Create schemas
 */
export const ItemCreateSchema = z.object({
  item_type_id: IdSchema,
  room_id: IdSchema,
  attributes: z.array(ClientAttributeSchema).min(0).max(50),
});

export const TransactionCreateSchema = z.object({
  // asumsi minimal field; tambah field fixed lain jika API mensyaratkan
  attributes: z.array(ClientAttributeSchema).min(1, "Minimal 1 atribut"),
});

export type ItemCreateInput = z.infer<typeof ItemCreateSchema>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
export type ClientAttribute = z.infer<typeof ClientAttributeSchema>;
export type ServerAttribute = z.infer<typeof ServerAttributeSchema>;

/**
 * Helper konversi atribut UI -> payload server
 */
export function toServerAttributes(
  attrs: ClientAttribute[]
): ServerAttribute[] {
  return attrs.map((a) => {
    if (a.type === "number") {
      const n = typeof a.value === "number" ? a.value : Number(a.value as any);
      return { key: a.key, value: Number.isFinite(n) ? n : 0 };
    }
    if (a.type === "multivalue") {
      const arr = Array.isArray(a.value)
        ? a.value
        : String(a.value ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      return { key: a.key, value: arr };
    }
    // text/select/date fallback as string
    return {
      key: a.key,
      value: Array.isArray(a.value) ? a.value.join(",") : String(a.value ?? ""),
    };
  });
}
