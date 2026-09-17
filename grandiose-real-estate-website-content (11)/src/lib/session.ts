import { SignJWT, jwtVerify } from "jose";

/** Session cookie name (per specification). */
export const ADMIN_COOKIE = "admin_token";

/** Legacy cookie name kept so stale sessions are cleared on login/logout. */
export const LEGACY_ADMIN_COOKIE = "grandiose_admin_session";

/** 24 hours, in seconds. */
export const SESSION_MAX_AGE = 60 * 60 * 24;

export type AdminRole = "admin" | "super_admin";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET || "grandiose-dev-secret";
  return new TextEncoder().encode(secret);
}

/**
 * Cookie attributes required for a secure admin session:
 * HttpOnly (no JS access), Secure in production, SameSite=Lax (CSRF-safe
 * top-level navigation), path=/ (visible to every /admin/* route).
 */
export function sessionCookieOptions(secure?: boolean) {
  return {
    httpOnly: true,
    // Defaults to production behaviour, but callers pass the real request
    // protocol so a Secure cookie is never issued over plain HTTP — which the
    // browser would silently discard and bounce the user back to /admin/login.
    secure: secure ?? process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.role || !payload.name) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email ?? payload.sub),
      name: String(payload.name),
      role: payload.role as AdminRole,
    } satisfies SessionPayload;
  } catch {
    return null;
  }
}
