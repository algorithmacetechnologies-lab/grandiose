import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, LEGACY_ADMIN_COOKIE, verifySessionToken } from "@/lib/session";

const LOGIN_PATH = "/admin/login";
const DEFAULT_DESTINATION = "/admin/dashboard";

/** Anything that looks like a file (e.g. .png, .js, .map) is never guarded. */
function isStaticAsset(pathname: string) {
  return pathname.includes(".") || pathname.startsWith("/_next") || pathname.startsWith("/uploads");
}

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

/**
 * Next.js 16 request-boundary guard (replaces the deprecated middleware convention).
 *
 * Matcher is limited to `/admin/:path*` so static assets, public pages and the
 * auth API itself can never be intercepted — which removes any possibility of a
 * self-referential redirect loop.
 *
 * Two rules prevent the login refresh loop:
 *  1. An authenticated visitor requesting /admin/login is forwarded to the dashboard.
 *  2. An invalid/expired token is deleted before redirecting, so the browser can
 *     never replay a rejected cookie back into the guard.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (isStaticAsset(pathname)) return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const session = await verifySessionToken(token);

  // Rule 1 — already signed in: never render the login form again.
  if (pathname === LOGIN_PATH) {
    if (session) {
      const url = new URL(DEFAULT_DESTINATION, request.url);
      return noStore(NextResponse.redirect(url, 302));
    }
    return NextResponse.next();
  }

  if (session) return NextResponse.next();

  // Rule 2 — unauthenticated: drop any stale cookie, then redirect to login.
  const loginUrl = new URL(LOGIN_PATH, request.url);
  const requested = `${pathname}${search}`;
  if (requested && requested !== LOGIN_PATH) {
    loginUrl.searchParams.set("next", requested);
  }

  const response = NextResponse.redirect(loginUrl, 302);
  response.cookies.delete(ADMIN_COOKIE);
  response.cookies.delete(LEGACY_ADMIN_COOKIE);
  return noStore(response);
}

export const config = {
  matcher: ["/admin/:path*"],
};
