// src/types/rooms.ts
import { z } from "zod";
import { ResponseEnvelopeWithPage } from "./api.common";

export const RoomSchema = z.object({
  room_id: z.string(),
  name: z.string(),
  code: z.string(),
  status: z.string(), // "ACTIVE" dll.
  corporates: z.object({
    corporate_id: z.string(),
    name: z.string(),
    code: z.string(),
  }),
});

export const RoomListSchema = ResponseEnvelopeWithPage(z.array(RoomSchema));
export type Room = z.infer<typeof RoomSchema>;
export type RoomListResponse = z.infer<typeof RoomListSchema>;

// Query params validator reuse PagingQuerySchema jika perlu
