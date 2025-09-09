import { NextResponse } from "next/server";

const COOKIE = process.env.AUTH_COOKIE_NAME ?? "__app_auth";

export function respondUnauthorized(message = "SESSION_EXPIRED") {
  const res = NextResponse.json({ code: 401, message }, { status: 401 });
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  res.headers.set("x-session-expired", "1");
  return res;
}
