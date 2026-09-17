import { NextResponse } from "next/server";
import { configuredUsername, isPasswordConfigured, passwordSource } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Exposes only non-sensitive login configuration (never the password). */
export async function GET() {
  return NextResponse.json({
    username: configuredUsername(),
    configured: isPasswordConfigured(),
    source: passwordSource(),
  });
}
