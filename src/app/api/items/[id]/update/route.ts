import { NextResponse } from "next/server";
import { z } from "zod";
import { extFetch } from "@/server/bff";
import { respondUnauthorized } from "@/server/auth-respond";
import { ItemUpdateBodySchema, ItemUpdateResponseSchema } from "@/types/items";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = ItemUpdateBodySchema.safeParse(body);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return NextResponse.json(
      { message: "Invalid body", issues: tree },
      { status: 400 }
    );
  }

  const upstream = await extFetch(`items/${encodeURIComponent(id)}/update`, {
    withAuth: true,
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  if (upstream.status === 401) return respondUnauthorized("NO_SESSION");

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return new NextResponse(text || `HTTP ${upstream.status}`, {
      status: upstream.status,
    });
  }

  const json = await upstream.json();
  const validated = ItemUpdateResponseSchema.safeParse(json);
  if (!validated.success) {
    return NextResponse.json(
      { message: "Invalid upstream response (item update)" },
      { status: 502 }
    );
  }

  return NextResponse.json(validated.data, { status: 200 });
}
