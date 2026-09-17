"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ServiceIcon, { SERVICE_ICON_KEYS, SERVICE_ICON_LABELS } from "@/components/ServiceIcon";
import { ConfirmButton, notify } from "@/components/admin/ui";

type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number | null;
  isActive: boolean | null;
};

const emptyForm = {
  id: 0,
  title: "",
  description: "",
  icon: "ShoppingBag",
  order: "1",
  isActive: true,
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/services", { cache: "no-store" });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const sorted = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

  function startNew() {
    setForm({ ...emptyForm, order: String(sorted.length + 1) });
    setOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editItem(item: Service) {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon || "ShoppingBag",
      order: String(item.order ?? 1),
      isActive: item.isActive !== false,
    });
    setOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/services", {
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
      notify(form.id ? "Service updated" : "Service created");
      setOpen(false);
      setForm(emptyForm);
      await load();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: number) {
    const response = await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error || "Delete failed");
      return;
    }
    notify("Service deleted");
    await load();
  }

  async function move(id: number, direction: -1 | 1) {
    const index = sorted.findIndex((item) => item.id === id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;

    await Promise.all([
      fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sorted[index], order: swapWith.order ?? 0 }),
      }),
      fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...swapWith, order: sorted[index].order ?? 0 }),
      }),
    ]);
    notify("Service order updated");
    await load();
  }

  return (
    <AdminShell
      title="Services Manager"
      subtitle="Edit, re-order and publish the core service categories shown on the public Services page."
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#6f685c]">
          {sorted.length} service{sorted.length === 1 ? "" : "s"} ·{" "}
          {sorted.filter((item) => item.isActive !== false).length} published
        </p>
        <button onClick={startNew} className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {open && (
        <form onSubmit={onSubmit} className="mb-8 w-full rounded-xl border border-[#d8c18d] bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="font-serif text-xl sm:text-2xl">
              {form.id ? "Edit service" : "New service"}
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close form"
              className="border border-[#d8c18d] p-2 text-[#765615]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="form-label">Service title</span>
              <input
                className="form-input w-full"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </label>

            <label className="block text-sm">
              <span className="form-label">Icon</span>
              <select
                className="form-input w-full"
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
              >
                {SERVICE_ICON_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {SERVICE_ICON_LABELS[key] || key}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="form-label">Display order</span>
              <input
                className="form-input w-full"
                type="number"
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-4 rounded-lg border border-[#eadfbe] bg-[#fffdf8] p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[#C5A25D]">
              <ServiceIcon icon={form.icon} className="h-7 w-7" />
            </div>
            <p className="text-xs text-[#6f685c]">Live icon preview</p>
          </div>

          <label className="mt-4 block text-sm">
            <span className="form-label">Description</span>
            <textarea
              className="form-textarea w-full"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </label>

          <label className="mt-4 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            Published on the public website
          </label>

          <button
            disabled={saving}
            className="btn-primary mt-6 w-full disabled:opacity-60 sm:w-auto"
            type="submit"
          >
            {saving ? "Saving..." : form.id ? "Update Service" : "Create Service"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="rounded-xl border border-[#d8c18d] bg-white p-6 text-sm text-[#6f685c]">
          Loading services...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((item, index) => (
            <article
              key={item.id}
              className="flex h-full flex-col rounded-xl border-t-4 border-[#C5A25D] bg-white p-5 shadow-md transition hover:shadow-xl sm:p-6"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-[#C5A25D]">
                <ServiceIcon icon={item.icon} className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-medium leading-snug text-[#211d16] sm:text-xl">
                {item.title}
              </h3>
              <span className="mt-3 block h-px w-12 bg-[#C5A25D]" />
              <p className="mt-3 flex-1 text-sm leading-7 text-[#6f685c]">{item.description}</p>

              <p className="mt-3 text-xs text-[#8a8378]">
                Order {item.order} · {item.isActive === false ? "Hidden" : "Published"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => void move(item.id, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="border border-[#d8c18d] p-2 text-[#765615] disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => void move(item.id, 1)}
                  disabled={index === sorted.length - 1}
                  aria-label="Move down"
                  className="border border-[#d8c18d] p-2 text-[#765615] disabled:opacity-40"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => editItem(item)}
                  className="inline-flex items-center gap-2 border border-[#d8c18d] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#765615]"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <ConfirmButton
                  label="Delete"
                  message={`Delete the "${item.title}" service?`}
                  className="inline-flex items-center gap-2 border border-[#d8c18d] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-700"
                  onConfirm={() => removeItem(item.id)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
