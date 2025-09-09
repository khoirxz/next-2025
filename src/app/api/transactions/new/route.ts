import { NextResponse } from "next/server";
import { z } from "zod";
import { extFetch } from "@/server/bff";
import { respondUnauthorized } from "@/server/auth-respond";
import {
  InTxnCreateBodySchema,
  InTxnCreateResponseSchema,
} from "@/types/transaction";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = InTxnCreateBodySchema.safeParse(body);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return NextResponse.json(
      { message: "Invalid body", issues: tree },
      { status: 400 }
    );
  }

  const upstream = await extFetch(`in-transactions/create`, {
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

  const validated = InTxnCreateResponseSchema.safeParse(json);
  if (!validated.success) {
    return NextResponse.json(
      { message: "Invalid upstream response (in transaction create)" },
      { status: 502 }
    );
  }

  return NextResponse.json(validated.data, { status: 200 });
}
