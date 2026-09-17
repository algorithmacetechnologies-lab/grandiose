import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  return clearSessionCookies(NextResponse.json({ success: true, redirectTo: "/admin/login" }));
}
