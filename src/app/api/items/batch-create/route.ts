import { NextResponse } from "next/server";
import { z } from "zod";
import { extFetch } from "@/server/bff";
import {
  ItemBatchCreateBodySchema,
  ItemBatchCreateResponseSchema,
} from "@/types/items";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ItemBatchCreateBodySchema.safeParse(body);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return NextResponse.json(
      { message: "Invalid body", issues: tree },
      { status: 400 }
    );
  }

  const upstream = await extFetch(`/items/batch-create`, {
    withAuth: true,
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return new NextResponse(text || `HTTP ${upstream.status}`, {
      status: upstream.status,
    });
  }

  const json = await upstream.json();
  const validated = ItemBatchCreateResponseSchema.safeParse(json);
  if (!validated.success) {
    return NextResponse.json(
      { message: "Invalid upstream response (items batch-create)" },
      { status: 502 }
    );
  }

  return NextResponse.json(validated.data, { status: 200 });
}
