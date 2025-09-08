export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { extFetch } from "@/server/bff";
import { ItemTypeListSchema, ItemTypeSchema } from "@/types/itemTypes"; // schema yang kita buat tadi

export async function GET(req: Request) {
  // Ambil query dari URL: q, page, limit
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const page = url.searchParams.get("page") ?? "1";
  const limit = url.searchParams.get("limit") ?? "10";

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  qs.set("page", page);
  qs.set("limit", limit);

  // Panggil API eksternal via BFF dengan Authorization dari cookie httpOnly
  const upstream = await extFetch(`item-types?${qs.toString()}`, {
    withAuth: true,
  });

  // Kalau upstream error (401/403/404/500), forward apa adanya (client.ts akan handle 401)
  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return new NextResponse(text || `HTTP ${upstream.status}`, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "text/plain",
      },
    });
  }

  // Validasi payload upstream biar UI dapat data bersih/terprediksi
  const json = await upstream.json();

  const parsed = ItemTypeListSchema.safeParse(json);
  if (!parsed.success) {
    // Payload upstream tidak sesuai contoh → beri 502 agar cepat ketahuan
    return NextResponse.json(
      { message: "Invalid upstream response (item-types)" },
      { status: 502 }
    );
  }

  // Kembalikan envelope yang sama (code, message, data[], pageInfo)
  return NextResponse.json(parsed.data, { status: 200 });
}
