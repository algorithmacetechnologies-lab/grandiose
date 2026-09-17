"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { legalNotes } from "@/lib/content";

const documents = [
  {
    id: "property",
    label: "General Property Disclaimer",
    body: legalNotes.propertyDisclaimer,
  },
  {
    id: "professional",
    label: "Professional Services Disclaimer",
    body: legalNotes.professionalDisclaimer,
  },
  {
    id: "privacy",
    label: "Privacy Notice",
    body: legalNotes.privacyNotice,
  },
];

export default function FooterLegal() {
  const [active, setActive] = useState<(typeof documents)[number] | null>(null);

  useEffect(() => {
    if (!active) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active]);

  return (
    <>
      <div className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500/90">
            Trust &amp; Legal Notes
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {documents.map((doc) => (
              <li key={doc.id}>
                <button
                  type="button"
                  onClick={() => setActive(doc)}
                  className="text-sm text-slate-400 underline decoration-white/20 underline-offset-4 transition hover:text-amber-500 hover:decoration-amber-500/60"
                >
                  {doc.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={active.label}
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-[#C5A25D]/40 bg-[#1A1D20] p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <h2 className="font-serif text-2xl leading-tight text-white sm:text-3xl">
                {active.label}
              </h2>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="shrink-0 border border-white/20 p-2 text-slate-300 transition hover:border-amber-500 hover:text-amber-500"
              >
                <FiX />
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-400">{active.body}</p>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="mt-7 w-full bg-[#C5A25D] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1D20] transition hover:bg-amber-500 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
