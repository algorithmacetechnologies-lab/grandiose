import Link from "next/link";
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import FooterLegal from "@/components/FooterLegal";
import { staticAssets } from "@/lib/assets";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Properties for Sale", href: "/properties" },
  {
    label: "Flagship Projects",
    href: "/properties?category=Gated%20%26%20Smart%20Communities",
  },
  { label: "Our Team", href: "/team" },
  { label: "Partners", href: "/partners" },
  { label: "Sell / List Property", href: "/list-property" },
  { label: "Contact Us", href: "/contact" },
];

const coreServices = [
  "Land Acquisition & Sales",
  "Housing Construction",
  "Smart Housing & Communities",
  "Civil Engineering",
  "Renovation & Upgrades",
  "Property Management",
  "Real Estate Consultancy",
  "Building Materials",
];

const WHATSAPP_URL = "https://wa.me/233249488135";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full max-w-full overflow-x-hidden bg-[#1A1D20] text-slate-300">
      {/* Main 4-column grid */}
      <div className="mx-auto w-full max-w-[1380px] px-5 py-14 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Column 1 — Brand & About */}
          <div className="max-w-sm">
            {/* Official logo on a light plate so the white-background source
                file renders cleanly on the dark footer without any filters. */}
            <Link
              href="/"
              className="inline-block max-w-full bg-white p-3 sm:p-4"
              aria-label="Grandiose Real Estate Ltd"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={staticAssets.logo}
                alt="Grandiose Real Estate Ltd"
                width={256}
                height={198}
                className="h-auto w-48 object-contain md:w-56 lg:w-64"
              />
            </Link>

            <p className="mt-6 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-amber-500">
              Building Communities. Creating Value. Delivering Excellence.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Grandiose Real Estate Ltd is a Ghanaian real estate development and construction
              company providing land acquisition, housing development, civil engineering,
              renovations, property management, and material supply services.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <nav aria-label="Footer navigation">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Quick Links
            </h2>
            <span className="mt-3 block h-px w-10 bg-[#C5A25D]" />
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-500"
                  >
                    <FiArrowUpRight className="text-xs text-[#C5A25D]/70 transition group-hover:text-amber-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 — Core Services */}
          <nav aria-label="Core services">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Core Services
            </h2>
            <span className="mt-3 block h-px w-10 bg-[#C5A25D]" />
            <ul className="mt-5 space-y-3">
              {coreServices.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-500"
                  >
                    <FiArrowUpRight className="text-xs text-[#C5A25D]/70 transition group-hover:text-amber-500" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4 — Contact & Office Info */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Contact &amp; Office
            </h2>
            <span className="mt-3 block h-px w-10 bg-[#C5A25D]" />

            <address className="mt-5 space-y-4 not-italic text-sm leading-6 text-slate-400">
              <p className="flex gap-3">
                <FiMapPin className="mt-1 shrink-0 text-[#C5A25D]" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Office Address
                  </span>
                  GE-155-1898, Mensah Anteh Avenue, Kwabenya Hills, Accra, Ghana
                </span>
              </p>
              <p className="flex gap-3">
                <FiMapPin className="mt-1 shrink-0 text-[#C5A25D]" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Postal Address
                  </span>
                  P.O. Box LT 143, Laterbiokoshie, Accra, Ghana
                </span>
              </p>
              <p className="flex gap-3">
                <FiMail className="mt-1 shrink-0 text-[#C5A25D]" />
                <a
                  href="mailto:grandioseestate@gmail.com"
                  className="break-all transition hover:text-amber-500"
                >
                  grandioseestate@gmail.com
                </a>
              </p>
              <p className="flex gap-3">
                <FiPhone className="mt-1 shrink-0 text-[#C5A25D]" />
                <a
                  href="tel:+233249488135"
                  className="transition hover:text-amber-500"
                >
                  +233 24 948 8135 / 0302 918 303
                </a>
              </p>
            </address>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href="/list-property"
                className="inline-flex flex-1 items-center justify-center gap-2 bg-[#C5A25D] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1A1D20] transition hover:bg-amber-500"
              >
                List Your Property
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 border border-[#C5A25D] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C5A25D] transition hover:bg-[#C5A25D] hover:text-[#1A1D20]"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & disclaimer row (full width, above bottom bar) */}
      <FooterLegal />

      {/* Bottom copyright bar */}
      <div className="border-t border-white/10 bg-[#14171A]">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col items-center justify-between gap-3 px-5 py-5 text-center md:flex-row md:gap-6 md:px-10 md:text-left">
          <p className="order-1 w-full text-[11px] uppercase tracking-[0.12em] text-slate-500 md:w-auto">
            © {year} Grandiose Real Estate Ltd. All rights reserved.
          </p>
          <p className="order-2 w-full text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C5A25D] md:w-auto md:text-right">
            Developed By Algorithm Ace Technologies
          </p>
        </div>
      </div>
    </footer>
  );
}
