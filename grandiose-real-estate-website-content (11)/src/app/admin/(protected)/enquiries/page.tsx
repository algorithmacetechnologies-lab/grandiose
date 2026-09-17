"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmButton, notify } from "@/components/admin/ui";

type Enquiry = {
  id: number;
  fullName: string;
  telephone: string;
  email: string;
  propertyOrService: string;
  preferredLocation: string | null;
  budgetRange: string | null;
  purpose: string | null;
  preferredDate: string | null;
  additionalInfo: string | null;
  status: string | null;
  createdAt: string;
};

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/enquiries");
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: number, status: string) {
    const response = await fetch("/api/admin/enquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error || "Update failed");
      return;
    }
    notify("Enquiry updated");
    await load();
  }

  async function removeItem(id: number) {
    const response = await fetch("/api/admin/enquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error || "Delete failed");
      return;
    }
    notify("Enquiry deleted");
    await load();
  }

  return (
    <AdminShell
      title="Lead & Enquiry Manager"
      subtitle="Inbox for buyer and contact form submissions."
    >
      <div className="space-y-4">
        {loading ? <div className="border border-[#d8c18d] bg-white p-6">Loading enquiries...</div> : null}
        {!loading && items.length === 0 ? (
          <div className="border border-[#d8c18d] bg-white p-6">No enquiries yet.</div>
        ) : null}
        {items.map((item) => (
          <article key={item.id} className="border border-[#d8c18d] bg-white p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <h3 className="font-serif text-2xl">{item.fullName}</h3>
                <p className="mt-1 text-sm text-[#6f685c]">
                  {item.telephone} · {item.email}
                </p>
                <p className="mt-3 text-sm">{item.propertyOrService}</p>
                <p className="mt-2 text-sm text-[#6f685c]">
                  Location: {item.preferredLocation || "N/A"} · Budget: {item.budgetRange || "N/A"} · Purpose: {item.purpose || "N/A"}
                </p>
                {item.preferredDate ? (
                  <p className="mt-2 text-sm text-[#6f685c]">
                    Preferred inspection date: {new Date(item.preferredDate).toLocaleDateString()}
                  </p>
                ) : null}
                {item.additionalInfo ? (
                  <p className="mt-2 text-sm leading-7 text-[#6f685c]">{item.additionalInfo}</p>
                ) : null}
                <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#b88a2a]">
                  Status: {item.status || "new"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["new", "contacted", "in_progress", "closed"].map((status) => (
                  <button
                    key={status}
                    className="border border-[#d8c18d] px-3 py-2 text-xs uppercase"
                    onClick={() => void updateStatus(item.id, status)}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
                <ConfirmButton
                  label="Delete"
                  message="Delete this enquiry?"
                  className="border border-[#d8c18d] px-3 py-2 text-xs uppercase text-red-700"
                  onConfirm={() => removeItem(item.id)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
