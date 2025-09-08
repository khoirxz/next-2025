export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { extFetch } from "@/server/bff";
import { LoginBodySchema, LoginResponseSchema } from "@/types/auth";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "__app_auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const valid = LoginBodySchema.parse(body);

    const upstream = await extFetch("login", {
      method: "POST",
      body: JSON.stringify(valid),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return new NextResponse(text || `HTTP ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const json = await upstream.json();
    const parsed = LoginResponseSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid upstream response" },
        { status: 502 }
      );
    }
    if (parsed.data.code !== 0) {
      return NextResponse.json(parsed.data, { status: 400 });
    }

    if (!upstream.ok) {
      if (upstream.status === 404) {
        return NextResponse.json(
          { code: 401, message: "User not found" },
          { status: 401 }
        );
      }
      const text = await upstream.text().catch(() => "");
      return new NextResponse(text || `HTTP ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const { token, ...profile } = parsed.data.data;

    // ⬇️ SET COOKIE LANGSUNG DI RESPONSE
    const res = NextResponse.json(
      { code: 0, message: "Success", data: profile },
      { status: 200 }
    );
    const maxAge = Number(process.env.AUTH_COOKIE_MAX_AGE ?? 60 * 60 * 24 * 7);
    const isProd = process.env.NODE_ENV === "production";
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.errors ?? "Internal error", code: e?.code ?? 500 },
      { status: 500 }
    );
  }
}
