"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmButton, notify, uploadFile } from "@/components/admin/ui";
import { assetPath } from "@/lib/assets";

type Property = {
  id: number;
  title: string;
  referenceNumber: string | null;
  description: string;
  type: string;
  category: string | null;
  location: string;
  landmarks: string | null;
  price: string;
  currency: string | null;
  landSize: string | null;
  floorArea: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  amenities: string | null;
  status: string | null;
  isFeatured: boolean | null;
  images: string[] | null;
  videoUrl: string | null;
  sitePlanUrl: string | null;
  projectName: string | null;
};

const emptyForm = {
  id: 0,
  title: "",
  referenceNumber: "",
  description: "",
  type: "House",
  category: "Houses for Sale",
  location: "",
  landmarks: "",
  price: "",
  currency: "GHS",
  landSize: "",
  floorArea: "",
  bedrooms: "",
  bathrooms: "",
  parking: "",
  amenities: "",
  status: "available",
  isFeatured: false,
  images: "",
  videoUrl: "",
  sitePlanUrl: "",
  projectName: "",
};

const categories = [
  "Houses for Sale",
  "Apartments & Townhouses",
  "Residential Land",
  "Commercial & Development Land",
  "Commercial Properties",
  "Gated & Smart Communities",
];

export default function AdminPropertiesPage() {
  const [items, setItems] = useState<Property[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/properties");
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        (item.referenceNumber || "").toLowerCase().includes(term);
      const matchesStatus = status === "all" || (item.status || "") === status;
      const matchesCategory = category === "all" || (item.category || "") === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, search, status, category]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function editItem(item: Property) {
    setForm({
      id: item.id,
      title: item.title || "",
      referenceNumber: item.referenceNumber || "",
      description: item.description || "",
      type: item.type || "House",
      category: item.category || "Houses for Sale",
      location: item.location || "",
      landmarks: item.landmarks || "",
      price: item.price || "",
      currency: item.currency || "GHS",
      landSize: item.landSize || "",
      floorArea: item.floorArea || "",
      bedrooms: item.bedrooms?.toString() || "",
      bathrooms: item.bathrooms?.toString() || "",
      parking: item.parking?.toString() || "",
      amenities: item.amenities || "",
      status: item.status || "available",
      isFeatured: Boolean(item.isFeatured),
      images: (item.images || []).join("\n"),
      videoUrl: item.videoUrl || "",
      sitePlanUrl: item.sitePlanUrl || "",
      projectName: item.projectName || "",
    });
    setOpen(true);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        id: form.id || undefined,
        images: form.images
          .split(/\n|,/)
          .map((value) => value.trim())
          .filter(Boolean),
      };
      const response = await fetch("/api/admin/properties", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      notify(form.id ? "Property updated" : "Property created");
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
    const response = await fetch("/api/admin/properties", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error || "Delete failed");
      return;
    }
    notify("Property deleted");
    await load();
  }

  async function onUpload(files: FileList | null, target: "images" | "sitePlanUrl") {
    if (!files?.length) return;
    try {
      if (target === "images") {
        const urls: string[] = [];
        for (const file of Array.from(files)) {
          urls.push(await uploadFile(file, "properties"));
        }
        setForm((prev) => ({
          ...prev,
          images: [prev.images, ...urls].filter(Boolean).join("\n"),
        }));
      } else {
        const url = await uploadFile(files[0], "site-plans");
        setForm((prev) => ({ ...prev, sitePlanUrl: url }));
      }
      notify("Upload complete");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Upload failed");
    }
  }

  return (
    <AdminShell
      title="Property & Flagship Project Manager"
      subtitle="Create, update and feature residential, commercial and land opportunities."
    >
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-3">
          <input className="form-input" placeholder="Search properties" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select className="form-input" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
          <select className="form-input" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setForm(emptyForm);
            setOpen(true);
          }}
        >
          Add New Property
        </button>
      </div>

      {open && (
        <form onSubmit={onSubmit} className="mb-8 border border-[#d8c18d] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-2xl">{form.id ? "Edit property" : "Add property"}</h3>
            <button type="button" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["title", "Title"],
              ["referenceNumber", "Listing Reference ID"],
              ["type", "Type"],
              ["location", "Location"],
              ["landmarks", "Nearby landmarks"],
              ["price", "Asking price"],
              ["landSize", "Land size"],
              ["floorArea", "Floor area"],
              ["bedrooms", "Bedrooms"],
              ["bathrooms", "Bathrooms"],
              ["parking", "Parking slots"],
              ["projectName", "Project name"],
              ["videoUrl", "Video URL"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="form-label">{label}</span>
                <input
                  className="form-input"
                  value={String((form as Record<string, unknown>)[key] ?? "")}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  required={["title", "location", "price"].includes(key)}
                />
              </label>
            ))}
            <label className="block text-sm">
              <span className="form-label">Category</span>
              <select className="form-input" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="form-label">Status</span>
              <select className="form-input" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="form-label">Currency</span>
              <select className="form-input" value={form.currency} onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}>
                <option value="GHS">GHS</option>
                <option value="USD">USD</option>
              </select>
            </label>
          </div>
          <label className="mt-4 block text-sm">
            <span className="form-label">Description</span>
            <textarea className="form-textarea" required value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          </label>
          <label className="mt-4 block text-sm">
            <span className="form-label">Key features / amenities</span>
            <textarea className="form-textarea" value={form.amenities} onChange={(e) => setForm((prev) => ({ ...prev, amenities: e.target.value }))} />
          </label>
          <label className="mt-4 block text-sm">
            <span className="form-label">Gallery image URLs</span>
            <textarea className="form-textarea" value={form.images} onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))} />
          </label>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="form-label">Upload gallery images</span>
              <input type="file" multiple accept="image/*" onChange={(e) => void onUpload(e.target.files, "images")} />
            </label>
            <label className="block text-sm">
              <span className="form-label">Upload site plan</span>
              <input type="file" accept="image/*,application/pdf" onChange={(e) => void onUpload(e.target.files, "sitePlanUrl")} />
              {form.sitePlanUrl ? <p className="mt-2 text-xs text-[#6f685c]">{form.sitePlanUrl}</p> : null}
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))} />
            Featured / Flagship Project
          </label>
          <button disabled={saving} className="btn-primary mt-6 disabled:opacity-60" type="submit">
            {saving ? "Saving..." : form.id ? "Update Property" : "Create Property"}
          </button>
        </form>
      )}

      {/* Mobile card view */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="border border-[#d8c18d] bg-white p-5 text-sm text-[#6f685c]">
            Loading properties...
          </div>
        ) : pageItems.length === 0 ? (
          <div className="border border-[#d8c18d] bg-white p-5 text-sm text-[#6f685c]">
            No properties found.
          </div>
        ) : (
          pageItems.map((item) => (
            <article key={item.id} className="border border-[#d8c18d] bg-white">
              <div className="relative h-44 w-full overflow-hidden bg-[#f6efdf]">
                {item.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetPath(item.images[0])} alt={item.title} className="h-full w-full object-cover" />
                ) : null}
                <span className="absolute left-3 top-3 bg-[#fcfaf5] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#765615]">
                  {item.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg leading-tight text-[#211d16]">{item.title}</h3>
                <p className="mt-1 text-xs text-[#6f685c]">{item.referenceNumber}</p>
                <p className="mt-3 text-sm font-semibold text-[#765615]">
                  {item.currency} {item.price}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#b88a2a]">
                  {item.category}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 border border-[#d8c18d] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em]"
                    onClick={() => editItem(item)}
                  >
                    Edit
                  </button>
                  <ConfirmButton
                    label="Delete"
                    message="Delete this property permanently?"
                    className="flex-1 border border-[#d8c18d] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-700"
                    onConfirm={() => removeItem(item.id)}
                  />
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden w-full overflow-x-auto border border-[#d8c18d] bg-white md:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-[#102a43] text-xs uppercase tracking-[0.12em] text-[#e6cb8d]">
            <tr>
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6" colSpan={6}>Loading properties...</td></tr>
            ) : pageItems.length === 0 ? (
              <tr><td className="px-4 py-6" colSpan={6}>No properties found.</td></tr>
            ) : (
              pageItems.map((item) => (
                <tr key={item.id} className="border-t border-[#eadfbe]">
                  <td className="px-4 py-3">
                    <div className="h-14 w-20 overflow-hidden bg-[#f6efdf]">
                      {item.images?.[0] ? <img src={assetPath(item.images[0])} alt="" className="h-full w-full object-cover" /> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-[#6f685c]">{item.referenceNumber}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{item.status}</td>
                  <td className="px-4 py-3">{item.currency} {item.price}</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="border border-[#d8c18d] px-3 py-2" onClick={() => editItem(item)}>Edit</button>
                      <ConfirmButton
                        label="Delete"
                        message="Delete this property permanently?"
                        className="border border-[#d8c18d] px-3 py-2 text-red-700"
                        onConfirm={() => removeItem(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button className="border border-[#d8c18d] px-3 py-2" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
        <span className="text-sm text-[#6f685c]">Page {page} of {totalPages}</span>
        <button className="border border-[#d8c18d] px-3 py-2" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </AdminShell>
  );
}
