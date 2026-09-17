import { NextRequest, NextResponse } from "next/server";
import {
  applySessionCookie,
  authenticateAdmin,
  configuredUsername,
  createSessionToken,
  isPasswordConfigured,
  isSecureRequest,
  passwordSource,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const REDIRECT_URL = "/admin/dashboard";

/**
 * Verifies ADMIN_USERNAME / ADMIN_PASSWORD against process.env (bcrypt compared
 * at runtime), then issues an HttpOnly session cookie and returns an explicit
 * JSON redirect target so the client never depends on an implicit navigation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const username = String(body?.username ?? body?.email ?? "").trim();
    const password = String(body?.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 },
      );
    }

    if (!isPasswordConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Administrator credentials are not configured on this server. Set ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH) in the environment.",
        },
        { status: 503 },
      );
    }

    const identity = await authenticateAdmin(username, password);
    if (!identity) {
      // Explicit, non-throwing 401 JSON — never an implicit server redirect.
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 },
      );
    }

    const token = await createSessionToken({
      sub: identity.username,
      email: identity.username,
      name: identity.name,
      role: identity.role,
    });

    // Explicit JSON contract so the client never depends on an implicit redirect.
    return applySessionCookie(
      NextResponse.json(
        {
          success: true,
          redirectUrl: REDIRECT_URL,
          redirectTo: REDIRECT_URL,
          admin: {
            username: identity.username,
            name: identity.name,
            role: identity.role,
          },
        },
        { status: 200 },
      ),
      // Spec: Secure in production. Also honour a detected TLS request so the
      // flag is never omitted on an HTTPS origin.
      token,
      process.env.NODE_ENV === "production" || isSecureRequest(request),
    );
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ username: configuredUsername(), redirectUrl: REDIRECT_URL });
}
