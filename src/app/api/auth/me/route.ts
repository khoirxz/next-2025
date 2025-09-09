// src/app/api/auth/me/route.ts
import { extFetch } from "@/server/bff";
import { respondUnauthorized } from "@/server/auth-respond";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await extFetch("/rooms?page=1&limit=1", { withAuth: true });
  if (res.status === 401) return respondUnauthorized();
  return NextResponse.json({ authenticated: true }, { status: 200 });
}
