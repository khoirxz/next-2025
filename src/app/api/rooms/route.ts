export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { extFetch } from "@/server/bff";
import { respondUnauthorized } from "@/server/auth-respond";
import { RoomListSchema } from "@/types/rooms";

export async function GET(req: Request) {
  // ambil query
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const page = url.searchParams.get("page") ?? "1";
  const limit = url.searchParams.get("limit") ?? "10";

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  qs.set("page", page);
  qs.set("limit", limit);

  // panggil API eksternal via BFF dengan Authorization dari cookie httpOnly
  const upstream = await extFetch(`rooms?${qs.toString()}`, {
    withAuth: true,
  });

  if (upstream.status === 401) return respondUnauthorized("NO_SESSION");

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
  const parsed = RoomListSchema.safeParse(json);
  // jika tidak sesuai maka kan dikembalikan dengan error 502
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid upstream response (rooms)" },
      { status: 502 }
    );
  }

  return NextResponse.json(parsed.data, { status: 200 });
}
