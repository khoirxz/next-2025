import { NextResponse } from "next/server";
import { extFetch } from "@/server/bff";
import { respondUnauthorized } from "@/server/auth-respond";
import { ItemDetailResponseSchema } from "@/types/items";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const upstream = await extFetch(`items/${encodeURIComponent(id)}`, {
    withAuth: true,
  });

  if (upstream.status === 401) return respondUnauthorized("NO_SESSION");

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return new NextResponse(text || `HTTP ${upstream.status}`, {
      status: upstream.status,
    });
  }

  const json = await upstream.json();
  const validated = ItemDetailResponseSchema.safeParse(json);
  if (!validated.success) {
    return NextResponse.json(
      { message: "Invalid upstream response (item detail)" },
      { status: 502 }
    );
  }

  return NextResponse.json(validated.data, { status: 200 });
}
