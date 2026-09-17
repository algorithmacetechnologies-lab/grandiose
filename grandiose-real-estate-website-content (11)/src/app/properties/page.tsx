import Link from "next/link";
import { desc } from "drizzle-orm";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { images, propertiesContent } from "@/lib/content";
import { assetPath } from "@/lib/assets";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  type?: string;
  category?: string;
  location?: string;
  status?: string;
  page?: string;
};

async function getProperties(searchParams: SearchParams) {
  const allProperties = await db
    .select()
    .from(properties)
    .orderBy(desc(properties.isFeatured), desc(properties.createdAt));

  let filtered = allProperties;

  if (searchParams.search) {
    const term = searchParams.search.toLowerCase();
    filtered = filtered.filter(
      (property) =>
        property.title.toLowerCase().includes(term) ||
        property.description.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term) ||
        (property.referenceNumber || "").toLowerCase().includes(term),
    );
  }

  if (searchParams.type) {
    filtered = filtered.filter(
      (property) => property.type.toLowerCase() === searchParams.type!.toLowerCase(),
    );
  }

  if (searchParams.category) {
    filtered = filtered.filter(
      (property) =>
        (property.category || "").toLowerCase() === searchParams.category!.toLowerCase(),
    );
  }

  if (searchParams.location) {
    filtered = filtered.filter((property) =>
      property.location.toLowerCase().includes(searchParams.location!.toLowerCase()),
    );
  }

  if (searchParams.status) {
    filtered = filtered.filter(
      (property) => (property.status || "").toLowerCase() === searchParams.status!.toLowerCase(),
    );
  }

  return filtered;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const params = await Promise.resolve(searchParams);
  const allProperties = await getProperties(params);
  const page = Number(params.page || "1");
  const limit = 9;
  const total = allProperties.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const propertiesList = allProperties.slice((page - 1) * limit, page * limit);

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={propertiesContent.heroTitle}
          body={propertiesContent.heroBody}
          image={images.properties}
          actions={
            <>
              <Link href="/contact" className="btn-primary gap-2">
                Book a Property Inspection <FiArrowUpRight />
              </Link>
              <Link
                href="/list-property"
                className="border border-[#e6cb8d] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                List Your Property
              </Link>
            </>
          }
        />

        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <form className="grid gap-4 border border-[#d8c18d] bg-[#fffdf8] p-5 md:grid-cols-5">
              <input
                name="search"
                defaultValue={params.search || ""}
                placeholder="Search by title, location or reference"
                className="form-input md:col-span-2"
              />
              <input
                name="type"
                defaultValue={params.type || ""}
                placeholder="Property type"
                className="form-input"
              />
              <input
                name="location"
                defaultValue={params.location || ""}
                placeholder="Location"
                className="form-input"
              />
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="bg-[#fcfaf5] py-20">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="max-w-3xl">
              <span className="eyebrow">Property Categories</span>
              <h2 className="section-title">Browse by opportunity type</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {propertiesContent.categories.map((category) => (
                <article key={category.title} className="border border-[#d8c18d] bg-white p-6">
                  <h3 className="font-serif text-2xl text-[#211d16]">{category.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f685c]">{category.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <img src={assetPath(images.verdant)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative mx-auto max-w-[1240px] px-5 py-20 md:px-10">
            <div className="max-w-3xl border-l border-[#d8c18d] pl-8 text-white md:pl-12">
              <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e6cb8d]">
                Featured Project
              </span>
              <h2 className="text-4xl font-medium md:text-5xl">{propertiesContent.verdantTitle}</h2>
              <p className="mt-6 text-base leading-8 text-white/80">{propertiesContent.verdantBody1}</p>
              <p className="mt-4 text-base leading-8 text-white/75">{propertiesContent.verdantBody2}</p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="eyebrow">Current Listings</span>
                <h2 className="section-title mb-0">Properties for sale and projects</h2>
              </div>
              <p className="text-sm text-[#6f685c]">
                Showing {propertiesList.length} of {total} listings
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {propertiesList.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link
                  href={`/properties?page=${Math.max(1, page - 1)}`}
                  className="border border-[#d8c18d] px-4 py-3 text-xs uppercase tracking-[0.14em]"
                >
                  Previous
                </Link>
                <span className="text-sm text-[#6f685c]">
                  Page {page} of {totalPages}
                </span>
                <Link
                  href={`/properties?page=${Math.min(totalPages, page + 1)}`}
                  className="border border-[#d8c18d] px-4 py-3 text-xs uppercase tracking-[0.14em]"
                >
                  Next
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-[#d8c18d] bg-[#fcfaf5] py-16">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 md:px-10 lg:grid-cols-2">
            <div>
              <span className="eyebrow">Listing Standards</span>
              <h2 className="section-title">Recommended information on every property listing</h2>
              <ul className="mt-6 space-y-3">
                {propertiesContent.listingInfo.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-[#4f493f]">
                    <FiCheck className="mt-1 shrink-0 text-[#b88a2a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[#d8c18d] bg-white p-7">
              <h3 className="font-serif text-2xl">Website note</h3>
              <p className="mt-4 text-sm leading-7 text-[#6f685c]">{propertiesContent.note}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
