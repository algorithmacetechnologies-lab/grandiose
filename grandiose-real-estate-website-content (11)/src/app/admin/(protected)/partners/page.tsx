"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmButton, notify, uploadFile } from "@/components/admin/ui";
import { assetPath } from "@/lib/assets";

type Partner = {
  id: number;
  name: string;
  category: string;
  description: string;
  logoUrl: string | null;
  website: string | null;
  order: number | null;
  isActive: boolean | null;
};

const emptyForm = {
  id: 0,
  name: "",
  category: "Developer",
  description: "",
  logoUrl: "",
  website: "",
  order: "0",
  isActive: true,
};

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/partners");
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    void load();
  }, []);

  function editItem(item: Partner) {
    setForm({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      logoUrl: item.logoUrl || "",
      website: item.website || "",
      order: String(item.order ?? 0),
      isActive: item.isActive !== false,
    });
    setOpen(true);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/partners", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: form.id || undefined,
          order: Number(form.order || 0),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      notify(form.id ? "Partner updated" : "Partner created");
      setOpen(false);
      setForm(emptyForm);
      await load();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function move(id: number, direction: -1 | 1) {
    const sorted = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
    const index = sorted.findIndex((item) => item.id === id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;

    await Promise.all([
      fetch("/api/admin/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sorted[index], order: swapWith.order || 0 }),
      }),
      fetch("/api/admin/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...swapWith, order: sorted[index].order || 0 }),
      }),
    ]);
    notify("Partner order updated");
    await load();
  }

  async function removeItem(id: number) {
    const response = await fetch("/api/admin/partners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error || "Delete failed");
      return;
    }
    notify("Partner deleted");
    await load();
  }

  return (
    <AdminShell
      title="Partner Directory Manager"
      subtitle="Manage partner logos, categories and relationship descriptions."
    >
      <div className="mb-6 flex justify-end">
        <button className="btn-primary" onClick={() => { setForm(emptyForm); setOpen(true); }}>
          Add Partner
        </button>
      </div>

      {open && (
        <form onSubmit={onSubmit} className="mb-8 border border-[#d8c18d] bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["name", "Company name"],
              ["category", "Category"],
              ["website", "Website"],
              ["order", "Display order"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="form-label">{label}</span>
                <input
                  className="form-input"
                  value={String((form as Record<string, unknown>)[key] ?? "")}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  required={key === "name" || key === "category"}
                />
              </label>
            ))}
          </div>
          <label className="mt-4 block text-sm">
            <span className="form-label">Relationship description</span>
            <textarea
              className="form-textarea"
              required
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </label>
          <label className="mt-4 block text-sm">
            <span className="form-label">Logo upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadFile(file, "partners");
                  setForm((prev) => ({ ...prev, logoUrl: url }));
                  notify("Logo uploaded");
                } catch (error) {
                  notify(error instanceof Error ? error.message : "Upload failed");
                }
              }}
            />
            {form.logoUrl ? <p className="mt-2 text-xs text-[#6f685c]">{form.logoUrl}</p> : null}
          </label>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
            Active
          </label>
          <button disabled={saving} className="btn-primary mt-6 disabled:opacity-60" type="submit">
            {saving ? "Saving..." : form.id ? "Update Partner" : "Create Partner"}
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items
          .slice()
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((item) => (
            <article key={item.id} className="border border-[#d8c18d] bg-white p-5">
              <div className="mb-4 flex h-16 w-16 items-center justify-center border border-[#d8c18d] bg-[#f6efdf]">
                {item.logoUrl ? <img src={assetPath(item.logoUrl)} alt={item.name} className="h-full w-full object-contain p-2" /> : item.name.slice(0, 2)}
              </div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#b88a2a]">{item.category}</p>
              <h3 className="mt-2 font-serif text-xl">{item.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f685c]">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="border border-[#d8c18d] px-3 py-2 text-xs" onClick={() => void move(item.id, -1)}>Up</button>
                <button className="border border-[#d8c18d] px-3 py-2 text-xs" onClick={() => void move(item.id, 1)}>Down</button>
                <button className="border border-[#d8c18d] px-3 py-2 text-xs" onClick={() => editItem(item)}>Edit</button>
                <ConfirmButton label="Delete" message="Delete this partner?" className="border border-[#d8c18d] px-3 py-2 text-xs text-red-700" onConfirm={() => removeItem(item.id)} />
              </div>
            </article>
          ))}
      </div>
    </AdminShell>
  );
}
