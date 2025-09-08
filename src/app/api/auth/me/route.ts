import { NextResponse } from "next/server";
import { extFetch } from "@/server/bff";

// Jika upstream tidak punya endpoint "me", kamu bisa return 200 kalau cookie ada.
// Di sini contoh: panggil endpoint yang butuh auth ringan (mis. /rooms?page=1&limit=1)
// hanya untuk validasi token. Sesuaikan dengan API kamu.
export async function GET() {
  const res = await extFetch("/rooms?page=1&limit=1", { withAuth: true });
  if (!("ok" in res) || !(res as Response).ok) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true }, { status: 200 });
}
