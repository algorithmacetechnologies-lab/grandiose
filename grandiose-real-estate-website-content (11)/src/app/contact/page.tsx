"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { brand, contactContent, images } from "@/lib/content";

const buyerInitial = {
  fullName: "",
  telephone: "",
  email: "",
  propertyOrService: "",
  preferredLocation: "",
  budgetRange: "",
  purpose: "residence",
  preferredDate: "",
  additionalInfo: "",
};

const ownerInitial = {
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  propertyType: "House",
  location: "",
  landSize: "",
  floorArea: "",
  askingPrice: "",
  ownershipDetails: "",
  description: "",
  keyFeatures: "",
  knownDisputes: "",
  preferredMarketing: "",
};

export default function ContactPage() {
  const [tab, setTab] = useState<"buyer" | "owner">("buyer");
  const [buyerForm, setBuyerForm] = useState(buyerInitial);
  const [ownerForm, setOwnerForm] = useState(ownerInitial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitBuyer(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buyerForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit enquiry");
      setMessage("Your enquiry has been submitted successfully.");
      setBuyerForm(buyerInitial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit enquiry");
    } finally {
      setSaving(false);
    }
  }

  async function submitOwner(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ownerForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit listing request");
      setMessage("Your property owner / agent form has been submitted successfully.");
      setOwnerForm(ownerInitial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit listing request");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={contactContent.heroTitle}
          body={contactContent.heroBody}
          image={images.contact}
          actions={
            <Link href="#contact-forms" className="btn-primary">
              Contact Grandiose Today
            </Link>
          }
        />

        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-[1240px] gap-6 px-5 md:grid-cols-3 md:px-10">
            <article className="border border-[#d8c18d] bg-[#fffdf8] p-6">
              <FiMapPin className="text-[#b88a2a]" />
              <h3 className="mt-4 font-serif text-2xl">Office Address</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f685c]">{brand.officeAddress}</p>
              <p className="mt-3 text-sm leading-7 text-[#6f685c]">{brand.postalAddress}</p>
            </article>
            <article className="border border-[#d8c18d] bg-[#fffdf8] p-6">
              <FiPhone className="text-[#b88a2a]" />
              <h3 className="mt-4 font-serif text-2xl">Telephone</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f685c]">{brand.phoneDisplay}</p>
            </article>
            <article className="border border-[#d8c18d] bg-[#fffdf8] p-6">
              <FiMail className="text-[#b88a2a]" />
              <h3 className="mt-4 font-serif text-2xl">Email</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f685c]">{brand.email}</p>
              <p className="mt-3 text-sm leading-7 text-[#6f685c]">
                Grandiose Real Estate Ltd - Ghana
              </p>
            </article>
          </div>
        </section>

        <section id="contact-forms" className="border-t border-[#d8c18d] bg-[#fcfaf5] py-20">
          <div className="mx-auto max-w-[980px] px-5 md:px-10">
            <div className="mb-8 flex flex-wrap gap-3">
              <button
                onClick={() => setTab("buyer")}
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] ${
                  tab === "buyer"
                    ? "bg-[#765615] text-white"
                    : "border border-[#d8c18d] bg-white text-[#765615]"
                }`}
              >
                Buyer / Property Enquiry Form
              </button>
              <button
                onClick={() => setTab("owner")}
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] ${
                  tab === "owner"
                    ? "bg-[#765615] text-white"
                    : "border border-[#d8c18d] bg-white text-[#765615]"
                }`}
              >
                Property Owner / Agent Listing Form
              </button>
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

            {tab === "buyer" ? (
              <form onSubmit={submitBuyer} className="border border-[#d8c18d] bg-white p-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["fullName", "Full name"],
                    ["telephone", "Telephone / WhatsApp"],
                    ["email", "Email address"],
                    ["propertyOrService", "Property or service required"],
                    ["preferredLocation", "Preferred location"],
                    ["budgetRange", "Budget or project value range"],
                  ].map(([key, label]) => (
                    <label key={key} className="block text-sm">
                      <span className="form-label">{label}</span>
                      <input
                        className="form-input"
                        required={["fullName", "telephone", "email", "propertyOrService"].includes(key)}
                        value={String((buyerForm as Record<string, string>)[key] ?? "")}
                        onChange={(event) =>
                          setBuyerForm((prev) => ({ ...prev, [key]: event.target.value }))
                        }
                      />
                    </label>
                  ))}
                  <label className="block text-sm">
                    <span className="form-label">Purpose</span>
                    <select
                      className="form-input"
                      value={buyerForm.purpose}
                      onChange={(event) =>
                        setBuyerForm((prev) => ({ ...prev, purpose: event.target.value }))
                      }
                    >
                      <option value="residence">Residence</option>
                      <option value="investment">Investment</option>
                      <option value="development">Development</option>
                      <option value="commercial use">Commercial use</option>
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="form-label">Preferred inspection or meeting date</span>
                    <input
                      type="date"
                      className="form-input"
                      value={buyerForm.preferredDate}
                      onChange={(event) =>
                        setBuyerForm((prev) => ({ ...prev, preferredDate: event.target.value }))
                      }
                    />
                  </label>
                </div>
                <label className="mt-4 block text-sm">
                  <span className="form-label">Additional information</span>
                  <textarea
                    className="form-textarea"
                    value={buyerForm.additionalInfo}
                    onChange={(event) =>
                      setBuyerForm((prev) => ({ ...prev, additionalInfo: event.target.value }))
                    }
                  />
                </label>
                <button disabled={saving} className="btn-primary mt-6 disabled:opacity-60" type="submit">
                  {saving ? "Submitting..." : "Submit Enquiry"}
                </button>
              </form>
            ) : (
              <form onSubmit={submitOwner} className="border border-[#d8c18d] bg-white p-6 md:p-8">
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
                        value={String((ownerForm as Record<string, string>)[key] ?? "")}
                        onChange={(event) =>
                          setOwnerForm((prev) => ({ ...prev, [key]: event.target.value }))
                        }
                      />
                    </label>
                  ))}
                </div>
                {[
                  ["ownershipDetails", "Ownership or agent authority details"],
                  ["description", "Property description"],
                  ["keyFeatures", "Key features"],
                  ["knownDisputes", "Known disputes or encumbrances, if any"],
                  ["preferredMarketing", "Preferred marketing arrangement"],
                ].map(([key, label]) => (
                  <label key={key} className="mt-4 block text-sm">
                    <span className="form-label">{label}</span>
                    <textarea
                      className="form-textarea"
                      required={key === "description"}
                      value={String((ownerForm as Record<string, string>)[key] ?? "")}
                      onChange={(event) =>
                        setOwnerForm((prev) => ({ ...prev, [key]: event.target.value }))
                      }
                    />
                  </label>
                ))}
                <button disabled={saving} className="btn-primary mt-6 disabled:opacity-60" type="submit">
                  {saving ? "Submitting..." : "Submit Listing Request"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
