import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE = process.env.AUTH_COOKIE_NAME ?? "__app_auth";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Lindungi halaman-halaman ini (bukan /api)
  const protectedPaths = ["/items", "/item-types", "/rooms", "/transactions"];
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return;

  const hasAuth = req.cookies.get(COOKIE)?.value;
  if (!hasAuth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/items/:path*",
    "/item-types/:path*",
    "/rooms/:path*",
    "/transactions/:path*",
  ],
};
