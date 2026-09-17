"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { images, partnersContent } from "@/lib/content";
import { assetPath } from "@/lib/assets";

type Partner = {
  id: number;
  name: string;
  category: string;
  description: string;
  logoUrl: string | null;
  website: string | null;
};

const initialForm = {
  organizationName: "",
  contactPerson: "",
  businessCategory: "",
  location: "",
  website: "",
  proposedCollaboration: "",
  companyProfile: "",
  email: "",
  phone: "",
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/admin/partners")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPartners(data.filter((item) => item.isActive !== false));
        }
      })
      .catch(() => undefined);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit partnership enquiry");
      setMessage("Your partnership enquiry has been submitted successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit partnership enquiry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={partnersContent.heroTitle}
          body={partnersContent.heroBody}
          image={images.partners}
          actions={
            <Link href="#partner-form" className="btn-primary gap-2">
              Become a Grandiose Partner <FiArrowUpRight />
            </Link>
          }
        />

        <section className="bg-[#fcfaf5] py-20">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="max-w-3xl">
              <span className="eyebrow">Partnership Areas</span>
              <h2 className="section-title">Where collaboration strengthens delivery</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {partnersContent.areas.map((area) => (
                <article key={area.title} className="border border-[#d8c18d] bg-white p-6">
                  <h3 className="font-serif text-2xl text-[#211d16]">{area.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f685c]">{area.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="max-w-3xl">
              <span className="eyebrow">Partner Directory</span>
              <h2 className="section-title">Partner companies and logos</h2>
              <p className="section-subtitle">{partnersContent.directoryNote}</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {partners.map((partner) => (
                <article key={partner.id} className="border border-[#d8c18d] bg-[#fffdf8] p-6">
                  <div className="mb-5 grid h-16 w-16 place-items-center border border-[#d8c18d] bg-white font-serif text-xl text-[#765615]">
                    {partner.logoUrl ? (
                      <img src={assetPath(partner.logoUrl)} alt={partner.name} className="h-full w-full object-contain p-2" />
                    ) : (
                      partner.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b88a2a]">
                    {partner.category}
                  </p>
                  <h3 className="mt-2 font-serif text-xl text-[#211d16]">{partner.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f685c]">{partner.description}</p>
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#765615]"
                    >
                      Visit website <FiArrowUpRight />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="partner-form" className="border-t border-[#d8c18d] bg-[#fcfaf5] py-20">
          <div className="mx-auto max-w-[980px] px-5 md:px-10">
            <div className="mb-8 max-w-3xl">
              <span className="eyebrow">{partnersContent.becomeTitle}</span>
              <h2 className="section-title">Partnership enquiry form</h2>
              <p className="section-subtitle">{partnersContent.becomeBody}</p>
            </div>

            {(message || error) && (
              <div
                className={`mb-6 border px-4 py-3 text-sm ${
                  error
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-[#d8c18d] bg-[#fff8ea] text-[#765615]"
                }`}
              >
                {error || message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="border border-[#d8c18d] bg-white p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["organizationName", "Organization name"],
                  ["contactPerson", "Contact person"],
                  ["businessCategory", "Business category"],
                  ["location", "Location"],
                  ["website", "Website"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                ].map(([key, label]) => (
                  <label key={key} className="block text-sm">
                    <span className="form-label">{label}</span>
                    <input
                      className="form-input"
                      required={["organizationName", "contactPerson", "businessCategory", "email"].includes(key)}
                      value={String((form as Record<string, string>)[key] ?? "")}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, [key]: event.target.value }))
                      }
                    />
                  </label>
                ))}
              </div>
              <label className="mt-4 block text-sm">
                <span className="form-label">Proposed area of collaboration</span>
                <textarea
                  className="form-textarea"
                  required
                  value={form.proposedCollaboration}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, proposedCollaboration: event.target.value }))
                  }
                />
              </label>
              <label className="mt-4 block text-sm">
                <span className="form-label">Supporting company profile</span>
                <textarea
                  className="form-textarea"
                  value={form.companyProfile}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, companyProfile: event.target.value }))
                  }
                />
              </label>
              <button disabled={saving} className="btn-primary mt-6 disabled:opacity-60" type="submit">
                {saving ? "Submitting..." : "Become a Grandiose Partner"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
