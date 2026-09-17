"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { notify, uploadFile } from "@/components/admin/ui";

const emptySettings = {
  siteName: "",
  siteSubtitle: "",
  tagline: "",
  countryYear: "",
  website: "",
  officeAddress: "",
  postalAddress: "",
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  heroEyebrow: "",
  heroHeadline: "",
  heroSubcopy: "",
  heroImageUrl: "",
  ctaPrimaryLabel: "",
  ctaPrimaryHref: "",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "",
  ctaTertiaryLabel: "",
  ctaTertiaryHref: "",
  statsProperties: "",
  statsPortfolioValue: "",
  statsSatisfaction: "",
  statsQuality: "",
  inspectionFee: "",
  salesCommission: "",
  rentalCommission: "",
  footerBlurb: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/settings")
      .then((response) => response.json())
      .then((data) => {
        setForm({
          siteName: data.siteName || "",
          siteSubtitle: data.siteSubtitle || "",
          tagline: data.tagline || "",
          countryYear: data.countryYear || "",
          website: data.website || "",
          officeAddress: data.officeAddress || "",
          postalAddress: data.postalAddress || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          whatsappNumber: data.whatsappNumber || "",
          heroEyebrow: data.heroEyebrow || "",
          heroHeadline: data.heroHeadline || "",
          heroSubcopy: data.heroSubcopy || "",
          heroImageUrl: data.heroImageUrl || "",
          ctaPrimaryLabel: data.ctaPrimaryLabel || "",
          ctaPrimaryHref: data.ctaPrimaryHref || "",
          ctaSecondaryLabel: data.ctaSecondaryLabel || "",
          ctaSecondaryHref: data.ctaSecondaryHref || "",
          ctaTertiaryLabel: data.ctaTertiaryLabel || "",
          ctaTertiaryHref: data.ctaTertiaryHref || "",
          statsProperties: data.statsProperties || "",
          statsPortfolioValue: data.statsPortfolioValue || "",
          statsSatisfaction: data.statsSatisfaction || "",
          statsQuality: data.statsQuality || "",
          inspectionFee: data.inspectionFee || "",
          salesCommission: data.salesCommission || "",
          rentalCommission: data.rentalCommission || "",
          footerBlurb: data.footerBlurb || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      notify("Site settings updated");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell title="Site Content & Hero Settings" subtitle="Loading settings...">
        <div className="border border-[#d8c18d] bg-white p-6">Loading...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Site Content & Hero Settings"
      subtitle="Update company details, fees, homepage hero content and portfolio statistics."
    >
      <form onSubmit={onSubmit} className="space-y-8">
        <section className="border border-[#d8c18d] bg-white p-6">
          <h3 className="font-serif text-2xl">Global Company Info</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["siteName", "Site name"],
              ["siteSubtitle", "Site subtitle"],
              ["tagline", "Tagline"],
              ["countryYear", "Country / year"],
              ["website", "Website"],
              ["contactEmail", "Official email"],
              ["contactPhone", "Phone numbers"],
              ["whatsappNumber", "WhatsApp number"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="form-label">{label}</span>
                <input className="form-input" value={String((form as Record<string, string>)[key] || "")} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} />
              </label>
            ))}
          </div>
          <label className="mt-4 block text-sm">
            <span className="form-label">Office address</span>
            <textarea className="form-textarea" value={form.officeAddress} onChange={(e) => setForm((prev) => ({ ...prev, officeAddress: e.target.value }))} />
          </label>
          <label className="mt-4 block text-sm">
            <span className="form-label">Postal address</span>
            <textarea className="form-textarea" value={form.postalAddress} onChange={(e) => setForm((prev) => ({ ...prev, postalAddress: e.target.value }))} />
          </label>
        </section>

        <section className="border border-[#d8c18d] bg-white p-6">
          <h3 className="font-serif text-2xl">Fee & Rate Settings</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["inspectionFee", "Property inspection fee"],
              ["salesCommission", "Sales commission"],
              ["rentalCommission", "Rental commission"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="form-label">{label}</span>
                <input className="form-input" value={String((form as Record<string, string>)[key] || "")} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} />
              </label>
            ))}
          </div>
        </section>

        <section className="border border-[#d8c18d] bg-white p-6">
          <h3 className="font-serif text-2xl">Home Banner & Hero Text</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["heroEyebrow", "Hero eyebrow"],
              ["statsProperties", "Properties stat"],
              ["statsPortfolioValue", "Portfolio value stat"],
              ["statsSatisfaction", "Satisfaction stat"],
              ["statsQuality", "Quality stat"],
              ["ctaPrimaryLabel", "Primary CTA label"],
              ["ctaPrimaryHref", "Primary CTA link"],
              ["ctaSecondaryLabel", "Secondary CTA label"],
              ["ctaSecondaryHref", "Secondary CTA link"],
              ["ctaTertiaryLabel", "Tertiary CTA label"],
              ["ctaTertiaryHref", "Tertiary CTA link"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="form-label">{label}</span>
                <input className="form-input" value={String((form as Record<string, string>)[key] || "")} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} />
              </label>
            ))}
          </div>
          <label className="mt-4 block text-sm">
            <span className="form-label">Hero headline</span>
            <textarea className="form-textarea" value={form.heroHeadline} onChange={(e) => setForm((prev) => ({ ...prev, heroHeadline: e.target.value }))} />
          </label>
          <label className="mt-4 block text-sm">
            <span className="form-label">Hero subcopy</span>
            <textarea className="form-textarea" value={form.heroSubcopy} onChange={(e) => setForm((prev) => ({ ...prev, heroSubcopy: e.target.value }))} />
          </label>
          <label className="mt-4 block text-sm">
            <span className="form-label">Hero background image upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadFile(file, "hero");
                  setForm((prev) => ({ ...prev, heroImageUrl: url }));
                  notify("Hero image uploaded");
                } catch (error) {
                  notify(error instanceof Error ? error.message : "Upload failed");
                }
              }}
            />
            {form.heroImageUrl ? <p className="mt-2 text-xs text-[#6f685c]">{form.heroImageUrl}</p> : null}
          </label>
          <label className="mt-4 block text-sm">
            <span className="form-label">Footer blurb</span>
            <textarea className="form-textarea" value={form.footerBlurb} onChange={(e) => setForm((prev) => ({ ...prev, footerBlurb: e.target.value }))} />
          </label>
        </section>

        <button disabled={saving} className="btn-primary disabled:opacity-60" type="submit">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </AdminShell>
  );
}
