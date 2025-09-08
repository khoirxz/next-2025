import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_UPSTREAM;
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME;

export async function getAuthTokenFromCookie() {
  const cookieStore = await cookies();
  const c = cookieStore.get(COOKIE_NAME || "");
  return c ? c.value : null;
}

type Opts = RequestInit & { withAuth?: boolean };

export async function extFetch(path: string, opts: Opts = {}) {
  const url = `${BASE}${path}`;
  const token = opts.withAuth ? await getAuthTokenFromCookie() : null;

  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    // BFF jalan di server
    cache: "no-store",
  });

  // forward error
  if (!res.ok) {
    const text = await res.text().catch(() => "");

    throw new Response(text || `HTTP ${res.status}`, { status: res.status });
  }

  return res;
}
