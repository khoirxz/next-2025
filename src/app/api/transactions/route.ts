export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { extFetch } from "@/server/bff";
import { respondUnauthorized } from "@/server/auth-respond";
import { InTxnListResponseSchema } from "@/types/transaction";

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
  const upstream = await extFetch(`in-transactions?${qs.toString()}`, {
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
    if (
      /tidak ditemukan/i.test(reason) ||
      /not found/i.test(reason) ||
      /no data/i.test(reason)
    ) {
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

  const parsed = InTxnListResponseSchema.safeParse(json);

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
