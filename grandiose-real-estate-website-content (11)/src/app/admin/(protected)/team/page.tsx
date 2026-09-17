"use client";

import { FormEvent, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { ConfirmButton, notify } from "@/components/admin/ui";
import TeamAvatar from "@/components/TeamAvatar";

type Member = {
  id: number;
  name: string;
  position: string;
  bio: string | null;
  photoUrl: string | null;
  email: string | null;
  phone: string | null;
  order: number | null;
  isActive: boolean | null;
};

const emptyForm = {
  id: 0,
  name: "",
  position: "",
  bio: "",
  photoUrl: "",
  email: "",
  phone: "",
  order: "1",
  isActive: true,
};

export default function AdminTeamPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/team", { cache: "no-store" });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function editItem(item: Member) {
    setForm({
      id: item.id,
      name: item.name,
      position: item.position,
      bio: item.bio || "",
      photoUrl: item.photoUrl || "",
      email: item.email || "",
      phone: item.phone || "",
      order: String(item.order ?? 1),
      isActive: item.isActive !== false,
    });
    setOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startNew() {
    setForm(emptyForm);
    setOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/team", {
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
      notify(form.id ? "Team member updated" : "Team member created");
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
    const response = await fetch("/api/admin/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error || "Delete failed");
      return;
    }
    notify("Team member deleted");
    await load();
  }

  return (
    <AdminShell
      title="Leadership & Team Manager"
      subtitle="Manage executive profiles and leadership photographs shown on the public Our Team page."
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#6f685c]">
          {items.length} team {items.length === 1 ? "member" : "members"}
        </p>
        <button onClick={startNew} className="btn-primary inline-flex items-center gap-2">
          <FiPlus /> Add Team Member
        </button>
      </div>

      {open && (
        <form
          onSubmit={onSubmit}
          className="mb-8 w-full border border-[#d8c18d] bg-white p-5 sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="font-serif text-xl sm:text-2xl">
              {form.id ? "Edit team member" : "New team member"}
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close form"
              className="border border-[#d8c18d] p-2 text-[#765615]"
            >
              <FiX />
            </button>
          </div>

          <ImageUpload
            label="Profile picture"
            folder="team"
            value={form.photoUrl}
            circular
            onChange={(url) => setForm((prev) => ({ ...prev, photoUrl: url }))}
          />

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="form-label">Full name</span>
              <input
                className="form-input w-full"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="form-label">Job title</span>
              <input
                className="form-input w-full"
                value={form.position}
                onChange={(e) => setForm((prev) => ({ ...prev, position: e.target.value }))}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="form-label">Email</span>
              <input
                className="form-input w-full"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="form-label">Phone</span>
              <input
                className="form-input w-full"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
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

          <label className="mt-4 block text-sm">
            <span className="form-label">Bio / responsibilities</span>
            <textarea
              className="form-textarea w-full"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            />
          </label>

          <label className="mt-4 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            Show on the public website
          </label>

          <button disabled={saving} className="btn-primary mt-6 w-full disabled:opacity-60 sm:w-auto" type="submit">
            {saving ? "Saving..." : form.id ? "Update Member" : "Create Member"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="border border-[#d8c18d] bg-white p-6 text-sm text-[#6f685c]">
          Loading team members...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="border border-[#d8c18d] bg-white p-5 sm:p-6">
              <TeamAvatar name={item.name} photoUrl={item.photoUrl} size="md" />

              <h3 className="mt-5 text-center font-serif text-xl leading-tight text-[#211d16] sm:text-2xl">
                {item.name}
              </h3>
              <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b88a2a] sm:text-[11px]">
                {item.position}
              </p>
              {item.bio ? (
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#6f685c]">{item.bio}</p>
              ) : null}
              <p className="mt-3 text-xs text-[#8a8378]">
                {item.photoUrl ? "Photo uploaded" : "No photo — initials fallback shown"}
                {item.isActive === false ? " · Hidden from website" : ""}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => editItem(item)}
                  className="inline-flex items-center gap-2 border border-[#d8c18d] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#765615]"
                >
                  <FiEdit2 /> Edit
                </button>
                <ConfirmButton
                  label="Delete"
                  message={`Delete ${item.name} from the team?`}
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
