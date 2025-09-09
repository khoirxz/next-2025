export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { extFetch } from "@/server/bff";
import { respondUnauthorized } from "@/server/auth-respond";
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

  if (upstream.status === 401) return respondUnauthorized("NO_SESSION");

  // 🩹 Normalisasi: 404 "Tidak ditemukan" → 200 dengan data kosong
  if (upstream.status === 404) {
    let requestId: string | undefined;
    let reason = "";
    try {
      const j = await upstream.clone().json();
      requestId = j?.requestId;
      reason = j?.errors || j?.message || "";
    } catch {
      /* ignore */
    }
    if (/tidak ditemukan/i.test(reason) || /not found/i.test(reason)) {
      const normalized = {
        code: 0,
        message: "Success",
        requestId: requestId ?? crypto.randomUUID(),
        data: [] as unknown[],
        pageInfo: { page, total_data: 0, total_page: 0 },
      };
      const res = NextResponse.json(normalized, { status: 200 });
      res.headers.set("x-upstream-status", "404");
      return res;
    }
    // 404 jenis lain → tetap forward sebagai error
    const text = await upstream.text().catch(() => "");
    return new NextResponse(text || "HTTP 404", { status: 404 });
  }

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
