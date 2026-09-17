"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { ConfirmButton, notify } from "@/components/admin/ui";

type Submission = {
  id: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  propertyType: string;
  location: string;
  askingPrice: string;
  currency: string | null;
  ownershipDetails: string | null;
  description: string;
  status: string | null;
  inspectionFeePaid: boolean | null;
  convertedPropertyId: number | null;
  isAgent: boolean | null;
};

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/submissions");
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateItem(id: number, payload: Record<string, unknown>) {
    const response = await fetch("/api/admin/submissions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error || "Update failed");
      return;
    }
    notify("Submission updated");
    await load();
  }

  async function removeItem(id: number) {
    const response = await fetch("/api/admin/submissions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error || "Delete failed");
      return;
    }
    notify("Submission deleted");
    await load();
  }

  return (
    <AdminShell
      title="Property Submissions & Agency Requests"
      subtitle="Review owner/agent listings from the public Sell or List Your Property form."
    >
      <div className="space-y-4">
        {loading ? <div className="border border-[#d8c18d] bg-white p-6">Loading submissions...</div> : null}
        {!loading && items.length === 0 ? (
          <div className="border border-[#d8c18d] bg-white p-6">No property submissions yet.</div>
        ) : null}
        {items.map((item) => (
          <article key={item.id} className="border border-[#d8c18d] bg-white p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <h3 className="font-serif text-2xl">{item.ownerName}</h3>
                <p className="mt-1 text-sm text-[#6f685c]">
                  {item.ownerPhone} · {item.ownerEmail}
                </p>
                <p className="mt-3 text-sm">
                  {item.propertyType} in {item.location} · {item.currency || "GHS"} {item.askingPrice}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#6f685c]">{item.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#b88a2a]">
                  Status: {item.status || "pending"} · Authority: {item.ownershipDetails || "Not provided"} · Fee paid: {item.inspectionFeePaid ? "Yes" : "No"}
                  {item.convertedPropertyId ? ` · Live listing #${item.convertedPropertyId}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="border border-[#d8c18d] px-3 py-2 text-xs uppercase" onClick={() => void updateItem(item.id, { inspectionFeePaid: !item.inspectionFeePaid })}>
                  Toggle GHS 300 Fee
                </button>
                {["pending", "approved", "rejected"].map((status) => (
                  <button key={status} className="border border-[#d8c18d] px-3 py-2 text-xs uppercase" onClick={() => void updateItem(item.id, { status })}>
                    {status}
                  </button>
                ))}
                <ConfirmButton
                  label="Delete"
                  message="Delete this submission?"
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
