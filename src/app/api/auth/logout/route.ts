// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

const COOKIE = process.env.AUTH_COOKIE_NAME ?? "__app_auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json(
    { code: 0, message: "Logged out" },
    { status: 200 }
  );
  // clear httpOnly cookie
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  res.headers.set("x-logged-out", "1");
  return res;
}

// (Optional) support GET so you can hit /api/auth/logout from a link
export const GET = POST;
