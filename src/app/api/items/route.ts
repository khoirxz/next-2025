export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { extFetch } from "@/server/bff";
import { ItemListQuerySchema, ItemListSchema } from "@/types/items";

export async function GET(req: Request) {
  // ambil query
  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());

  const parsedUrl = ItemListQuerySchema.safeParse(raw);
  if (!parsedUrl.success) {
    return NextResponse.json(
      { message: "Invalid query params" },
      { status: 400 }
    );
  }

  const { q, room_id, item_type_id, status, page, limit } = parsedUrl.data;

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (room_id) qs.set("room_id", room_id);
  if (item_type_id) qs.set("item_type_id", item_type_id);
  if (status) qs.set("status", status);
  qs.set("page", String(page));
  qs.set("limit", String(limit));

  // panggil API eksternal via BFF dengan Authorization dari cookie httpOnly
  const upstream = await extFetch(`items?${qs.toString()}`, {
    withAuth: true,
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return new NextResponse(text || `HTTP ${upstream.status}`, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "text/plain",
      },
    });
  }

  // validasi payload upstream biar UI dapat data bersih/terprediksi
  const json = await upstream.json();

  // json akan di cek apakah valid dengan zod
  const parsed = ItemListSchema.safeParse(json);
  // jika tidak sesuai maka kan dikembalikan dengan error 502
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid upstream response (rooms)" },
      { status: 502 }
    );
  }

  return NextResponse.json(parsed.data, { status: 200 });
}
