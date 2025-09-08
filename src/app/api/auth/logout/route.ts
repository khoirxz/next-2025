import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/server/cookie";

export async function POST() {
  clearAuthCookie();
  return NextResponse.json({ code: 0, message: "Logged out" });
}
