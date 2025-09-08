import { z } from "zod";

// ENUMS
export const MedicalType = z.enum(["MEDICAL", "NON_MEDICAL"]);
export const ItemStatus = z.enum([
  "REGISTERED",
  "WASH",
  "CLEAN",
  "STORED",
  "SENT",
  "USED",
  "DIRT",
  "DEFECT",
]);

export const InfectiousType = z.enum(["INFECTIOUS", "NON_INFECTIOUS"]);
export const WashType = z.enum(["NORMAL"]);

export const DeletedAny = z.union([z.enum(["NO", "YES"]), z.boolean()]);

// response
export const PageInfoSchema = z.object({
  page: z.number().int().nonnegative(),
  total_data: z.number().int().nonnegative(),
  total_page: z.number().int().nonnegative(),
});

export const ResponseEnvelope = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    code: z.number(),
    message: z.string(),
    requestId: z.string(),
    data: dataSchema,
  });
};

export const ResponseEnvelopeWithPage = <T extends z.ZodTypeAny>(
  dataSchema: T
) => {
  return z.object({
    code: z.number(),
    message: z.string(),
    requestId: z.string(),
    data: dataSchema,
    pageInfo: PageInfoSchema,
  });
};

// params
export const PagingQuerySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PagingQuery = z.infer<typeof PagingQuerySchema>;
