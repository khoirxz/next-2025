// src/types/auth.ts
import { z } from "zod";

export const LoginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export const LoginResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  requestId: z.string(),
  data: z.object({
    user_id: z.string(),
    name: z.string(),
    email: z.email(),
    phone: z.string().nullable(),
    type: z.string(),
    token: z.string(),
    division_id: z.string().optional().nullable(),
    level: z.string(),
    corporates: z.object({
      corporate_id: z.string(),
      code: z.string(),
      name: z.string(),
      address: z.string().optional().nullable(),
      phone: z.string().optional().nullable(),
    }),
  }),
});
export type LoginBody = z.infer<typeof LoginBodySchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
