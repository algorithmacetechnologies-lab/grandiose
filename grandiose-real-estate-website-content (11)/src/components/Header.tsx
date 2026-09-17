"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { navLinks } from "@/lib/content";
import { staticAssets } from "@/lib/assets";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (logoTimer.current) clearTimeout(logoTimer.current);
    };
  }, []);

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (logoTimer.current) clearTimeout(logoTimer.current);

    const nextCount = logoClicks + 1;
    if (nextCount >= 5) {
      setLogoClicks(0);
      setOpen(false);
      router.push("/admin");
      return;
    }

    setLogoClicks(nextCount);
    logoTimer.current = setTimeout(() => {
      setLogoClicks(0);
      router.push("/");
    }, 900);
  };

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-[#d8c18d] bg-[#fcfaf5]/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1380px] items-center justify-between px-4 py-2 sm:px-5 md:px-8 lg:px-10">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="relative flex h-full shrink-0 items-center overflow-visible"
          aria-label="Grandiose home"
        >
          {/* Official Grandiose logo — unmodified, natural aspect ratio. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staticAssets.logo}
            alt="Grandiose Real Estate Ltd"
            width={260}
            height={200}
            className="h-16 w-auto max-w-[155px] object-contain sm:max-w-[190px] md:h-20 md:max-w-[220px] lg:max-w-[245px]"
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#4f493f] transition-colors hover:text-[#b88a2a]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/list-property"
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#765615] hover:text-[#b88a2a]"
          >
            List a property
          </Link>
          <Link href="/contact" className="btn-primary gap-2">
            Contact Us <FiArrowUpRight />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-2xl text-[#765615] xl:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#d8c18d] bg-[#fcfaf5] px-5 py-7 xl:hidden">
          <nav className="mx-auto flex max-w-[1380px] flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#e8dcc1] py-4 text-xs font-semibold uppercase tracking-[0.17em] text-[#4f493f]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/list-property"
              onClick={() => setOpen(false)}
              className="btn-primary mt-6"
            >
              List your property
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
