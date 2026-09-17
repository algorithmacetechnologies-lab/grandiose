"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { images, listPropertyContent } from "@/lib/content";

type AgencyTerms = {
  inspectionFee: string;
  salesCommission: string;
  rentalCommission: string;
};

const initialForm = {
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  isAgent: false,
  agentAuthority: "",
  propertyType: "House",
  location: "",
  landSize: "",
  floorArea: "",
  askingPrice: "",
  currency: "GHS",
  ownershipDetails: "",
  description: "",
  keyFeatures: "",
  knownDisputes: "",
  encumbrances: "",
  preferredMarketing: "",
};

export default function ListPropertyPage() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [terms, setTerms] = useState<AgencyTerms>({
    inspectionFee: "GHS 300",
    salesCommission: "5% of final agreed sale price",
    rentalCommission: "10%",
  });

  useEffect(() => {
    void fetch("/api/settings")
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        setTerms({
          inspectionFee: data.inspectionFee || "GHS 300",
          salesCommission: data.salesCommission || "5% of final agreed sale price",
          rentalCommission: data.rentalCommission || "10%",
        });
      })
      .catch(() => undefined);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit listing");
      setMessage("Your property listing request has been submitted successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit listing");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={listPropertyContent.heroTitle}
          body={listPropertyContent.heroBody}
          image={images.list}
          actions={
            <Link href="#listing-form" className="btn-primary gap-2">
              List Your Property With Grandiose <FiArrowUpRight />
            </Link>
          }
        />

        <section className="bg-[#fcfaf5] py-20">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="max-w-3xl">
              <span className="eyebrow">How the Listing Process Works</span>
              <h2 className="section-title">A clear path from submission to completion</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {listPropertyContent.process.map((step, index) => (
                <article key={step} className="border border-[#d8c18d] bg-white p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                    Step {index + 1}
                  </span>
                  <p className="mt-3 text-sm leading-7 text-[#4f493f]">{step}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 md:px-10 lg:grid-cols-2">
            <div>
              <span className="eyebrow">Standard Agency Terms</span>
              <h2 className="section-title">Transparent commercial terms</h2>
              <div className="mt-6 overflow-hidden border border-[#d8c18d]">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f6efdf] text-xs uppercase tracking-[0.12em] text-[#765615]">
                    <tr>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Standard Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { service: "Property Inspection Fee", term: terms.inspectionFee },
                      { service: "Sales Commission", term: terms.salesCommission },
                      { service: "Rental Commission", term: terms.rentalCommission },
                      { service: "Developer / Special Mandates", term: "As agreed in writing" },
                    ].map((term) => (
                      <tr key={term.service} className="border-t border-[#eadfbe]">
                        <td className="px-4 py-3">{term.service}</td>
                        <td className="px-4 py-3">{term.term}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border border-[#d8c18d] bg-[#fffdf8] p-7">
              <h3 className="font-serif text-2xl">For Property Agents</h3>
              <p className="mt-4 text-sm leading-7 text-[#6f685c]">
                {listPropertyContent.agentsNote}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#4f493f]">
                <li className="flex gap-3">
                  <FiCheck className="mt-1 text-[#b88a2a]" />
                  Consent or authority of the lawful owner is required.
                </li>
                <li className="flex gap-3">
                  <FiCheck className="mt-1 text-[#b88a2a]" />
                  Known disputes and encumbrances must be disclosed.
                </li>
                <li className="flex gap-3">
                  <FiCheck className="mt-1 text-[#b88a2a]" />
                  Grandiose may decline incomplete or unclear mandates.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="listing-form" className="border-t border-[#d8c18d] bg-[#fcfaf5] py-20">
          <div className="mx-auto max-w-[980px] px-5 md:px-10">
            <div className="mb-8 max-w-3xl">
              <span className="eyebrow">List Your Property With Grandiose</span>
              <h2 className="section-title">Property owner / agent listing form</h2>
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
                  ["ownerName", "Owner or agent name"],
                  ["ownerPhone", "Telephone / WhatsApp"],
                  ["ownerEmail", "Email"],
                  ["propertyType", "Property type"],
                  ["location", "Property location"],
                  ["landSize", "Land size"],
                  ["floorArea", "Floor area"],
                  ["askingPrice", "Asking price"],
                ].map(([key, label]) => (
                  <label key={key} className="block text-sm">
                    <span className="form-label">{label}</span>
                    <input
                      className="form-input"
                      required={["ownerName", "ownerPhone", "ownerEmail", "propertyType", "location", "askingPrice"].includes(key)}
                      value={String((form as Record<string, unknown>)[key] ?? "")}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, [key]: event.target.value }))
                      }
                    />
                  </label>
                ))}
              </div>

              <label className="mt-4 flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isAgent}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, isAgent: event.target.checked }))
                  }
                />
                I am submitting as an authorized agent
              </label>

              {[
                ["ownershipDetails", "Ownership or agent authority details"],
                ["agentAuthority", "Agent authority / commission notes"],
                ["description", "Property description"],
                ["keyFeatures", "Key features"],
                ["knownDisputes", "Known disputes, if any"],
                ["encumbrances", "Encumbrances, if any"],
                ["preferredMarketing", "Preferred marketing arrangement"],
              ].map(([key, label]) => (
                <label key={key} className="mt-4 block text-sm">
                  <span className="form-label">{label}</span>
                  <textarea
                    className="form-textarea"
                    required={key === "description"}
                    value={String((form as Record<string, unknown>)[key] ?? "")}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, [key]: event.target.value }))
                    }
                  />
                </label>
              ))}

              <button disabled={saving} className="btn-primary mt-6 disabled:opacity-60" type="submit">
                {saving ? "Submitting..." : "List Your Property With Grandiose"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
