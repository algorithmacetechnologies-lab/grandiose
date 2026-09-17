"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { staticAssets } from "@/lib/assets";

const DEFAULT_DESTINATION = "/admin/dashboard";

/**
 * Reads the `next` query parameter at submit time.
 * Deliberately avoids useSearchParams(), which forces the whole login page to
 * bail out of server rendering and flash a bare Suspense fallback.
 */
function readNextParam() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("next");
}

function resolveDestination(next: string | null, redirectUrl?: string) {
  const candidate = redirectUrl || next || DEFAULT_DESTINATION;
  // Only ever navigate inside the admin area — prevents open-redirect abuse.
  if (!candidate.startsWith("/admin") || candidate.startsWith("/admin/login")) {
    return DEFAULT_DESTINATION;
  }
  return candidate;
}

export default function AdminLoginClient() {
  const router = useRouter();

  const [username, setUsername] = useState("Grandiose_Real_Estate");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const timers = useRef<number[]>([]);
  const navigated = useRef(false);

  useEffect(() => {
    void fetch("/api/auth/config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.username) setUsername(String(data.username));
        if (data && data.configured === false) {
          setNotice(
            "Administrator credentials are not configured on this server. Set ADMIN_PASSWORD in the server environment.",
          );
        }
      })
      .catch(() => undefined);

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  /**
   * Navigate only after the session is confirmed. A full-page assignment is
   * used deliberately: it guarantees the freshly issued cookie is sent, and the
   * proxy forwards an authenticated /admin/login request to the dashboard, so
   * this can never bounce back to a blank login form.
   */
  function go(destination: string) {
    if (navigated.current) return;
    navigated.current = true;

    router.push(destination);
    // Deferred so refresh() targets the destination route, not the login page.
    timers.current.push(window.setTimeout(() => router.refresh(), 0));

    timers.current.push(
      window.setTimeout(() => {
        if (window.location.pathname.startsWith("/admin/login")) {
          window.location.assign(destination);
        }
      }, 900),
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Stop the native HTML submit — the original cause of the page refresh.
    event.preventDefault();
    if (loading || navigated.current) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        redirectUrl?: string;
        redirectTo?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Invalid username or password");
      }

      // Confirm the browser actually stored the session cookie. Without this
      // check a rejected cookie (Secure flag over HTTP, third-party cookie
      // blocking) silently returned the user to a blank login form.
      const verification = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!verification.ok) {
        navigated.current = false;
        setLoading(false);
        setError(
          "Sign-in succeeded but your browser blocked the session cookie. Allow cookies for this site (or open it over HTTPS) and try again.",
        );
        return;
      }

      go(resolveDestination(readNextParam(), data.redirectUrl || data.redirectTo));
    } catch (err) {
      // Keep the entered values so the user can correct and retry.
      setError(err instanceof Error ? err.message : "Invalid username or password");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#102a43] px-4 py-10 sm:px-5">
      <form
        onSubmit={onSubmit}
        method="post"
        noValidate
        className="w-full max-w-md border border-[#d8c18d] bg-[#fcfaf5] p-6 shadow-2xl sm:p-8"
      >
        {/* Official logo displayed above the CMS welcome text. */}
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staticAssets.logo}
            alt="Grandiose Real Estate Ltd"
            width={256}
            height={198}
            className="h-auto w-52 object-contain md:w-64"
          />
        </div>
        <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b88a2a]">
          Secure Admin Access
        </p>
        <h1 className="mt-3 text-center font-serif text-2xl leading-tight text-[#102a43] sm:text-3xl">
          Grandiose CMS Login
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6f685c]">
          Authorized administrators only. Sessions are stored in HttpOnly secure cookies.
        </p>

        {notice ? (
          <div
            role="status"
            className="mt-5 border border-[#d8c18d] bg-[#fff8ea] px-4 py-3 text-sm text-[#765615]"
          >
            {notice}
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="mt-5 border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        ) : null}

        <label className="mt-6 block text-sm">
          <span className="form-label">Username</span>
          <input
            className="form-input w-full"
            type="text"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>

        <label className="mt-4 block text-sm">
          <span className="form-label">Password</span>
          <input
            className="form-input w-full"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:opacity-60"
          type="submit"
        >
          {loading ? "Signing in..." : "Sign in to Admin"}
        </button>

        <p className="mt-5 text-xs leading-6 text-[#6f685c]">
          The administrator password is stored securely in the server environment and is never
          exposed in the website source code.
        </p>
      </form>
    </div>
  );
}
