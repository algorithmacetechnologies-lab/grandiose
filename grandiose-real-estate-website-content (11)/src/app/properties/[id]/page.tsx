import Link from "next/link";
import { eq } from "drizzle-orm";
import { FiArrowLeft, FiCheck, FiMapPin } from "react-icons/fi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { images, propertiesContent } from "@/lib/content";
import { assetPath } from "@/lib/assets";

export const dynamic = "force-dynamic";

const fallbackImages = [
  images.residential,
  images.commercial,
  images.land,
  images.verdant,
];

function formatCurrency(amount: string, currency: string | null) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: currency || "GHS",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function parseImages(value: unknown, id: number) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map(String);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(String);
    } catch {
      if (value.trim()) return [value];
    }
  }
  return [fallbackImages[(id - 1) % fallbackImages.length]];
}

async function getProperty(id: string) {
  const rows = await db
    .select()
    .from(properties)
    .where(eq(properties.id, Number(id)))
    .limit(1);
  return rows[0] || null;
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolved = await Promise.resolve(params);
  const property = await getProperty(resolved.id);

  if (!property) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[980px] px-5 py-24 md:px-10">
          <h1 className="font-serif text-4xl">Property not found</h1>
          <Link href="/properties" className="btn-primary mt-8 inline-flex gap-2">
            <FiArrowLeft /> Back to properties
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const gallery = parseImages(property.images, property.id);
  const amenities = (property.amenities || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[460px] overflow-hidden">
          <img src={assetPath(gallery[0])} alt={property.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative mx-auto flex min-h-[460px] max-w-[1240px] items-end px-5 py-16 md:px-10">
            <div className="max-w-4xl text-white">
              <Link href="/properties" className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#e6cb8d]">
                <FiArrowLeft /> Back to properties
              </Link>
              <h1 className="text-4xl font-medium md:text-6xl">{property.title}</h1>
              <p className="mt-4 flex items-center gap-2 text-white/80">
                <FiMapPin /> {property.location}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fcfaf5] py-16">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 md:px-10 lg:grid-cols-[1.4fr_0.8fr]">
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {gallery.map((image) => (
                  <img key={image} src={assetPath(image)} alt={property.title} className="h-56 w-full object-cover" />
                ))}
              </div>
              <div className="mt-10 border border-[#d8c18d] bg-white p-7">
                <h2 className="font-serif text-3xl">Detailed property description</h2>
                <p className="mt-4 text-base leading-8 text-[#6f685c]">{property.description}</p>
                {property.landmarks ? (
                  <p className="mt-4 text-sm leading-7 text-[#6f685c]">
                    Nearby landmarks: {property.landmarks}
                  </p>
                ) : null}
              </div>
              {amenities.length > 0 && (
                <div className="mt-6 border border-[#d8c18d] bg-white p-7">
                  <h3 className="font-serif text-2xl">Key amenities and special features</h3>
                  <ul className="mt-5 grid gap-3 md:grid-cols-2">
                    {amenities.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-[#4f493f]">
                        <FiCheck className="mt-1 text-[#b88a2a]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="space-y-5">
              <div className="border border-[#d8c18d] bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b88a2a]">
                  Asking price
                </p>
                <p className="mt-2 font-serif text-3xl text-[#765615]">
                  {formatCurrency(property.price, property.currency)}
                </p>
                <div className="mt-6 space-y-3 text-sm text-[#4f493f]">
                  <p>Reference: {property.referenceNumber || "N/A"}</p>
                  <p>Type: {property.type}</p>
                  <p>Status: {property.status || "available"}</p>
                  {property.category ? <p>Category: {property.category}</p> : null}
                  {property.landSize ? <p>Land size: {property.landSize}</p> : null}
                  {property.floorArea ? <p>Floor area: {property.floorArea}</p> : null}
                  {property.bedrooms ? <p>Bedrooms: {property.bedrooms}</p> : null}
                  {property.bathrooms ? <p>Bathrooms: {property.bathrooms}</p> : null}
                  {property.parking ? <p>Parking: {property.parking}</p> : null}
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <Link href="/contact" className="btn-primary text-center">
                    Request Property Details
                  </Link>
                  <Link href="/contact" className="btn-outline text-center">
                    Book a Property Inspection
                  </Link>
                </div>
              </div>
              <div className="border border-[#d8c18d] bg-[#fffdf8] p-6 text-sm leading-7 text-[#6f685c]">
                {propertiesContent.note}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
