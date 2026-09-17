import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import ServiceIcon from "@/components/ServiceIcon";
import { db } from "@/db";
import { properties, services } from "@/db/schema";
import {
  brand,
  homeContent,
  images,
  pageBriefs,
} from "@/lib/content";
import { getSiteSettings } from "@/lib/site";
import { assetPath } from "@/lib/assets";

export const dynamic = "force-dynamic";

async function getFeaturedProperties() {
  return db
    .select()
    .from(properties)
    .where(eq(properties.isFeatured, true))
    .orderBy(desc(properties.createdAt))
    .limit(3);
}

async function getCoreServices() {
  try {
    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.order), asc(services.id));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProperties, settings, coreServices] = await Promise.all([
    getFeaturedProperties(),
    getSiteSettings(),
    getCoreServices(),
  ]);

  const stats = [
    { value: settings.statsProperties, label: "Properties in portfolio" },
    { value: settings.statsPortfolioValue, label: "Reported property value" },
    { value: settings.statsSatisfaction, label: "Customer satisfaction" },
    { value: settings.statsQuality, label: "Quality commitment" },
  ];

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[620px] overflow-hidden md:min-h-[70vh]">
          <img
            src={assetPath(settings.heroImageUrl || images.homeHero)}
            alt="Grandiose Real Estate residential development"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="relative mx-auto flex min-h-[620px] max-w-[1380px] items-end px-4 py-16 sm:px-5 md:min-h-[70vh] md:px-10 md:py-24">
            <div className="max-w-4xl text-white">
              <span className="mb-5 block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e6cb8d]">
                {settings.heroEyebrow || `${brand.countryYear} · ${brand.website}`}
              </span>
              <h1 className="text-3xl font-medium leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {settings.heroHeadline || homeContent.heroTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/80 sm:mt-7 sm:text-base sm:leading-8 md:text-lg">
                {settings.heroSubcopy || homeContent.heroBody1}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
                {homeContent.heroBody2}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={settings.ctaPrimaryHref || "/properties"} className="btn-primary gap-2">
                  {settings.ctaPrimaryLabel || "Explore Properties"} <FiArrowUpRight />
                </Link>
                <Link
                  href={settings.ctaSecondaryHref || "/list-property"}
                  className="border border-[#e6cb8d] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-[#765615]"
                >
                  {settings.ctaSecondaryLabel || "List Your Property"}
                </Link>
                <Link
                  href={settings.ctaTertiaryHref || "/contact"}
                  className="border border-white/40 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-[#765615]"
                >
                  {settings.ctaTertiaryLabel || "Speak With Grandiose"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d8c18d] bg-white py-16">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-y-10 px-5 md:grid-cols-4 md:px-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-l border-[#d8c18d] px-5 first:border-l-0 md:px-8"
              >
                <strong className="block font-serif text-3xl font-medium text-[#765615] md:text-4xl">
                  {stat.value}
                </strong>
                <span className="mt-2 block text-[10px] uppercase tracking-[0.16em] text-[#6f685c]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#fcfaf5] py-24 md:py-28">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="max-w-3xl">
              <span className="eyebrow">Website Structure</span>
              <h2 className="section-title">A brief of every page</h2>
              <p className="section-subtitle">
                Explore the complete Grandiose website structure, from company profile and services to properties, listing support, team, partners and contact.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {pageBriefs.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border border-[#d8c18d] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                    Page Brief
                  </span>
                  <h3 className="mt-3 font-serif text-2xl text-[#211d16]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f685c]">{item.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#765615]">
                    Open page <FiArrowUpRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Core services — CMS driven */}
        <section className="bg-[#f8f3e8] py-20 md:py-24">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-5 md:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">Our Core Services</span>
              <h2 className="section-title">Five service pillars built around your property goals</h2>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coreServices.map((service, index) => (
                <article
                  key={service.id}
                  className={`group flex h-full flex-col rounded-xl border-t-4 border-[#C5A25D] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    index === 3 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-[#C5A25D]">
                    <ServiceIcon icon={service.icon} className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-medium leading-snug text-[#211d16]">{service.title}</h3>
                  <span className="mt-4 block h-px w-12 bg-[#C5A25D]" />
                  <p className="mt-4 flex-1 text-sm leading-7 text-[#6f685c]">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/services" className="btn-outline gap-2">
                View all services <FiArrowUpRight />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 md:py-28">
          <div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="eyebrow">What We Do</span>
              <h2 className="section-title">Integrated solutions across the property value chain</h2>
              <div className="mt-8 space-y-8">
                {homeContent.highlights.map((item) => (
                  <div key={item.title} className="border-l border-[#d8c18d] pl-5">
                    <h3 className="font-serif text-2xl text-[#211d16]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6f685c]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[#d8c18d] bg-[#fffdf8] p-8">
              <ul className="space-y-4">
                {homeContent.whatWeDo.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-[#4f493f]">
                    <FiCheck className="mt-1 shrink-0 text-[#b88a2a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative min-h-[620px] overflow-hidden">
          <img
            src={assetPath(images.verdant)}
            alt="Verdant Valley smart community concept"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative mx-auto flex min-h-[620px] max-w-[1240px] items-center px-5 py-20 md:px-10">
            <div className="max-w-3xl border-l border-[#d8c18d] pl-8 text-white md:pl-12">
              <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e6cb8d]">
                Featured Project
              </span>
              <h2 className="text-4xl font-medium md:text-6xl">Verdant Valley</h2>
              <p className="mt-6 text-base leading-8 text-white/80 md:text-lg">
                Verdant Valley is Grandiose Real Estate Ltd&apos;s flagship smart-community concept. The project is presented as a 20-acre community designed around innovative living, smart-home technology and sustainable practices.
              </p>
              <p className="mt-4 text-base leading-8 text-white/75">
                The concept integrates green spaces and energy-efficient systems, with planned amenities such as parks, walking trails and community gardens.
              </p>
              <Link href="/properties" className="btn-primary mt-8 gap-2">
                Explore Properties <FiArrowUpRight />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#fcfaf5] py-24 md:py-28">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="eyebrow">Properties for Sale & Projects</span>
                <h2 className="section-title mb-0">Selected opportunities</h2>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#765615]"
              >
                View all properties <FiArrowUpRight />
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24 md:py-28">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="max-w-3xl">
              <span className="eyebrow">{homeContent.whyChoose.title}</span>
              <h2 className="section-title">{homeContent.whyChoose.subtitle}</h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {homeContent.whyChoose.stats.map((stat) => (
                <div key={stat.label} className="border border-[#d8c18d] bg-[#fffdf8] p-6">
                  <strong className="block font-serif text-3xl text-[#765615]">{stat.value}</strong>
                  <span className="mt-2 block text-sm text-[#6f685c]">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {homeContent.whyChoose.points.map((point) => (
                <article key={point.title} className="border border-[#d8c18d] p-7">
                  <h3 className="font-serif text-2xl text-[#211d16]">{point.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#6f685c]">{point.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gradient-brand py-20 text-white">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="max-w-3xl">
              <span className="mb-4 block text-[10px] uppercase tracking-[0.28em] text-[#f1ddb0]">
                Website Forms & Calls to Action
              </span>
              <h2 className="text-4xl font-medium md:text-5xl">
                Move your property plans forward with Grandiose.
              </h2>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {homeContent.ctas.map((cta) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className="border border-[#ead6a7] px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-[#765615]"
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
