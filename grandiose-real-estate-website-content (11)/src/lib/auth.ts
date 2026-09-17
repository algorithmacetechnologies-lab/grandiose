import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import {
  ADMIN_COOKIE,
  LEGACY_ADMIN_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  type AdminRole,
  type SessionPayload,
  verifySessionToken,
} from "@/lib/session";

export { ADMIN_COOKIE, createSessionToken, sessionCookieOptions, verifySessionToken };
export type { AdminRole, SessionPayload };

/**
 * Hardcoded administrator username (per specification).
 * May be overridden by the ADMIN_USERNAME environment variable.
 */
export const ADMIN_USERNAME = "Grandiose_Real_Estate";

export type AdminIdentity = {
  username: string;
  name: string;
  role: AdminRole;
};

/**
 * The admin password is NEVER stored in source control.
 * It is read from process.env.ADMIN_PASSWORD at runtime and bcrypt-hashed
 * in memory so the plaintext is only ever compared through bcrypt.
 */
/**
 * Deployment-resilient fallback: a one-way bcrypt hash (cost 10) of the
 * administrator password. This is NOT the password and cannot be reversed to
 * recover it. It exists only so the CMS remains sign-in capable when the
 * runtime environment does not expose ADMIN_PASSWORD (for example a host that
 * prunes gitignored .env.local files between deployments).
 *
 * Resolution order — the first available source wins:
 *   1. process.env.ADMIN_PASSWORD       (plaintext, per specification)
 *   2. process.env.ADMIN_PASSWORD_HASH  (bcrypt hash, safest for production)
 *   3. FALLBACK_ADMIN_PASSWORD_HASH     (committed bcrypt hash)
 */
const FALLBACK_ADMIN_PASSWORD_HASH =
  "$2b$10$XJfgwIFcH/cEhGOn/YLGFOYYCOmZuWlkbmWCW3JDoluxZ/7nqeJhi";

let cachedPasswordHash: string | null = null;
let cachedForPassword: string | null = null;

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function configuredUsername() {
  return readEnv("ADMIN_USERNAME") ?? ADMIN_USERNAME;
}

/** True when at least one credential source can verify a sign-in attempt. */
export function isPasswordConfigured() {
  return Boolean(
    readEnv("ADMIN_PASSWORD") || readEnv("ADMIN_PASSWORD_HASH") || FALLBACK_ADMIN_PASSWORD_HASH,
  );
}

export function passwordSource(): "env" | "env_hash" | "fallback_hash" {
  if (readEnv("ADMIN_PASSWORD")) return "env";
  if (readEnv("ADMIN_PASSWORD_HASH")) return "env_hash";
  return "fallback_hash";
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

/** Resolves the bcrypt hash used to verify the administrator password. */
async function getAdminPasswordHash() {
  const plaintext = readEnv("ADMIN_PASSWORD");
  if (plaintext) {
    if (!cachedPasswordHash || cachedForPassword !== plaintext) {
      cachedPasswordHash = await hashPassword(plaintext);
      cachedForPassword = plaintext;
    }
    return cachedPasswordHash;
  }

  const envHash = readEnv("ADMIN_PASSWORD_HASH");
  if (envHash) return envHash;

  return FALLBACK_ADMIN_PASSWORD_HASH;
}

/** Verifies the primary administrator credential (username + ADMIN_PASSWORD). */
export async function verifyMasterCredentials(
  username: string,
  password: string,
): Promise<AdminIdentity | null> {
  if (!username || !password) return null;
  if (username.trim() !== configuredUsername()) return null;

  const passwordHash = await getAdminPasswordHash();
  if (!passwordHash) return null;

  const valid = await compare(password, passwordHash);
  if (!valid) return null;

  return {
    username: configuredUsername(),
    name: "Grandiose Administrator",
    role: "super_admin",
  };
}

/** Keeps a database record in sync with the environment credential (RBAC audit trail). */
export async function ensureDefaultAdmins() {
  const passwordHash = await getAdminPasswordHash();
  if (!passwordHash) return;

  try {
    const username = configuredUsername();
    const rows = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
    const existing = rows[0];

    if (!existing) {
      await db.insert(admins).values({
        username,
        name: "Grandiose Administrator",
        email: null,
        passwordHash,
        role: "super_admin",
        isActive: true,
      });
      return;
    }

    if (existing.passwordHash !== passwordHash || existing.role !== "super_admin" || existing.isActive === false) {
      await db
        .update(admins)
        .set({
          passwordHash,
          role: "super_admin",
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(admins.id, existing.id));
    }
  } catch (error) {
    console.error("Unable to synchronize admin account:", error);
  }
}

/**
 * Authenticates an administrator.
 * 1. Primary credential: hardcoded username + ADMIN_PASSWORD (bcrypt compared at runtime).
 * 2. Fallback: additional database-managed accounts for RBAC (admin / super_admin).
 */
export async function authenticateAdmin(
  username: string,
  password: string,
): Promise<AdminIdentity | null> {
  const trimmed = (username || "").trim();
  if (!trimmed || !password) return null;

  const master = await verifyMasterCredentials(trimmed, password);
  if (master) {
    await ensureDefaultAdmins();
    return master;
  }

  try {
    const rows = await db.select().from(admins).where(eq(admins.username, trimmed)).limit(1);
    const admin = rows[0];
    if (!admin || admin.isActive === false) return null;

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) return null;

    await db
      .update(admins)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(admins.id, admin.id));

    return {
      username: admin.username ?? trimmed,
      name: admin.name,
      role: (admin.role as AdminRole) || "admin",
    };
  } catch {
    return null;
  }
}

/**
 * Writes the session cookie directly onto an outgoing response.
 * This is the reliable path for Route Handlers: the Set-Cookie header is
 * guaranteed to be attached to the very response the client awaited.
 */
export function applySessionCookie(response: NextResponse, token: string, secure?: boolean) {
  response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions(secure));
  response.cookies.delete(LEGACY_ADMIN_COOKIE);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

/** True when the inbound request arrived over TLS (directly or via proxy). */
export function isSecureRequest(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0].trim().toLowerCase() === "https";
  return request.nextUrl.protocol === "https:";
}

export function clearSessionCookies(response: NextResponse) {
  // Send BOTH Max-Age=0 and an epoch Expires date so every client
  // (browsers, proxies, HTTP tooling) reliably drops the session cookie.
  const expired = { ...sessionCookieOptions(), maxAge: 0, expires: new Date(0) };
  response.cookies.set(ADMIN_COOKIE, "", expired);
  response.cookies.set(LEGACY_ADMIN_COOKIE, "", expired);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

/** Cookie-store based helpers, for use from Server Actions / Server Components. */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, sessionCookieOptions());
  cookieStore.delete(LEGACY_ADMIN_COOKIE);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const expired = { ...sessionCookieOptions(), maxAge: 0, expires: new Date(0) };
  cookieStore.set(ADMIN_COOKIE, "", expired);
  cookieStore.set(LEGACY_ADMIN_COOKIE, "", expired);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireSession(minRole: AdminRole = "admin") {
  const session = await getSession();
  if (!session) return null;
  if (minRole === "super_admin" && session.role !== "super_admin") return null;
  return session;
}

export async function requireApiSession(minRole: AdminRole = "admin") {
  const session = await requireSession(minRole);
  if (!session) {
    const status = minRole === "super_admin" ? 403 : 401;
    return {
      session: null as SessionPayload | null,
      error: NextResponse.json(
        { error: minRole === "super_admin" ? "Super Admin access required" : "Unauthorized" },
        { status },
      ),
    };
  }
  return { session, error: null as NextResponse | null };
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
