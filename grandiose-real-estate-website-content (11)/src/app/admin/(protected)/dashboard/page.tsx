import Link from "next/link";
import { count, eq } from "drizzle-orm";
import AdminShell from "@/components/admin/AdminShell";
import { db } from "@/db";
import {
  enquiries,
  partners,
  properties,
  propertyListings,
} from "@/db/schema";
import { getSiteSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const settings = await getSiteSettings();
  const [propertyCount] = await db.select({ value: count() }).from(properties);
  const [partnerCount] = await db.select({ value: count() }).from(partners);
  const [pendingEnquiries] = await db
    .select({ value: count() })
    .from(enquiries)
    .where(eq(enquiries.status, "new"));
  const [pendingSubmissions] = await db
    .select({ value: count() })
    .from(propertyListings)
    .where(eq(propertyListings.status, "pending"));

  const cards = [
    { label: "Portfolio Properties", value: settings.statsProperties, detail: `${propertyCount.value} live listings` },
    { label: "Portfolio Value", value: settings.statsPortfolioValue, detail: "Editable homepage statistic" },
    {
      label: "Pending Leads",
      value: String((pendingEnquiries.value || 0) + (pendingSubmissions.value || 0)),
      detail: `${pendingEnquiries.value || 0} enquiries · ${pendingSubmissions.value || 0} submissions`,
    },
    { label: "Registered Partners", value: String(partnerCount.value || 0), detail: "Active partner directory" },
  ];

  return (
    <AdminShell
      title="Overview / Analytics"
      subtitle="Monitor portfolio performance, inbound leads and content health."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="border border-[#d8c18d] bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b88a2a]">
              {card.label}
            </p>
            <p className="mt-3 font-serif text-3xl text-[#102a43]">{card.value}</p>
            <p className="mt-2 text-sm text-[#6f685c]">{card.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/admin/properties" className="border border-[#d8c18d] bg-[#102a43] p-6 text-white">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#e6cb8d]">Quick Action</p>
          <h3 className="mt-3 font-serif text-2xl">Add New Property</h3>
          <p className="mt-2 text-sm text-white/70">
            Create residential, commercial, land or flagship community listings.
          </p>
        </Link>
        <Link href="/admin/enquiries" className="border border-[#d8c18d] bg-white p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#b88a2a]">Quick Action</p>
          <h3 className="mt-3 font-serif text-2xl text-[#102a43]">View Recent Leads</h3>
          <p className="mt-2 text-sm text-[#6f685c]">
            Review buyer enquiries, contact requests and inspection preferences.
          </p>
        </Link>
      </div>
    </AdminShell>
  );
}
