"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { staticAssets } from "@/lib/assets";
import {
  FiBriefcase,
  FiFileText,
  FiGrid,
  FiHome,
  FiInbox,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUsers,
  FiX,
} from "react-icons/fi";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/admin/properties", label: "Properties", icon: FiGrid },
  { href: "/admin/services", label: "Services", icon: FiLayers },
  { href: "/admin/submissions", label: "Submissions", icon: FiFileText },
  { href: "/admin/enquiries", label: "Enquiries", icon: FiInbox },
  { href: "/admin/partners", label: "Partners", icon: FiBriefcase },
  { href: "/admin/team", label: "Team", icon: FiUsers },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

type SessionUser = { name: string; email: string; role: string } | null;

export default function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser>(null);

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.session) setUser(data.session as SessionUser);
      })
      .catch(() => undefined);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
    // Hard navigation: the session cookie is already cleared, so a full page
    // load guarantees the login screen renders with no stale router state.
    window.location.assign("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1f2430]">
      <div className="flex min-h-screen">
        {open ? (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-[#d8c18d] bg-[#102a43] text-white transition-transform lg:static lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-4 sm:px-5">
            <div className="min-w-0">
              <span className="inline-flex h-16 max-w-full items-center bg-white px-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={staticAssets.logo}
                  alt="Grandiose Real Estate Ltd"
                  width={190}
                  height={146}
                  className="h-14 w-auto max-w-[180px] object-contain"
                />
              </span>
            </div>
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <FiX />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm ${
                    active ? "bg-[#b88a2a] text-white" : "text-white/75 hover:bg-white/5"
                  }`}
                >
                  <Icon />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            {user ? (
              <div className="mb-3 px-2">
                <p className="text-sm text-white/85">{user.name}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#e6cb8d]">
                  {user.role === "super_admin" ? "Super Admin" : "Admin"}
                </p>
              </div>
            ) : null}
            <button
              onClick={() => void logout()}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5"
            >
              <FiLogOut /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#d8c18d] bg-[#fcfaf5]/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-2 sm:px-5 md:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  className="shrink-0 border border-[#d8c18d] p-2 lg:hidden"
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                >
                  <FiMenu />
                </button>
                <span className="hidden h-14 shrink-0 items-center bg-white px-2 md:inline-flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={staticAssets.logo}
                    alt="Grandiose Real Estate Ltd"
                    width={110}
                    height={85}
                    className="h-12 w-auto object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-serif text-xl sm:text-2xl">{title}</h2>
                  {subtitle ? (
                    <p className="hidden truncate text-xs text-[#6f685c] xl:block">{subtitle}</p>
                  ) : null}
                </div>
              </div>
              <Link
                href="/"
                className="shrink-0 border border-[#d8c18d] px-3 py-2 text-[10px] uppercase tracking-[0.12em] sm:px-4 sm:text-xs sm:tracking-[0.14em]"
              >
                View site
              </Link>
            </div>
          </header>
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-5 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
