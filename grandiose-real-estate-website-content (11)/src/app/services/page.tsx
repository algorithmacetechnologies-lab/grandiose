import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { ArrowUpRight, Check } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ServiceIcon from "@/components/ServiceIcon";
import { db } from "@/db";
import { services } from "@/db/schema";
import { images, servicesContent } from "@/lib/content";

export const dynamic = "force-dynamic";

async function getServices() {
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

export default async function ServicesPage() {
  const coreServices = await getServices();

  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden">
        <PageHero
          title={servicesContent.heroTitle}
          body={servicesContent.heroBody}
          image={images.services}
          actions={
            <>
              <Link href="/contact" className="btn-primary gap-2">
                Request a Consultation <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/properties"
                className="border border-[#e6cb8d] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Explore Properties
              </Link>
            </>
          }
        />

        {/* Core services — CMS driven */}
        <section className="bg-[#fcfaf5] py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-5 md:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">Our Core Services</span>
              <h2 className="section-title">Five service pillars built around your property goals</h2>
              <p className="section-subtitle mx-auto">
                From sales and land documentation through to property management, agency duties and
                full-scale construction.
              </p>
            </div>

            {coreServices.length === 0 ? (
              <p className="mt-10 text-center text-sm text-[#6f685c]">
                Service information is being updated. Please check back shortly.
              </p>
            ) : (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {coreServices.map((service, index) => (
                  <article
                    key={service.id}
                    className={`group flex h-full flex-col rounded-xl border-t-4 border-[#C5A25D] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      index === 3 ? "lg:col-span-2" : ""
                    } ${index === 4 ? "lg:col-span-1" : ""}`}
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-[#C5A25D]">
                      <ServiceIcon icon={service.icon} className="h-7 w-7" />
                    </div>

                    <h3 className="text-xl font-medium leading-snug text-[#211d16] sm:text-2xl">
                      {service.title}
                    </h3>
                    <span className="mt-4 block h-px w-12 bg-[#C5A25D]" />
                    <p className="mt-4 flex-1 text-sm leading-7 text-[#6f685c]">
                      {service.description}
                    </p>

                    <Link
                      href="/contact"
                      className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#765615] transition group-hover:text-[#C5A25D]"
                    >
                      Enquire about this service <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Detailed service areas (supporting detail) */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-5 md:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">Detailed Service Areas</span>
              <h2 className="section-title">What each pillar covers</h2>
            </div>

            <div className="mt-10 space-y-6">
              {servicesContent.items.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-[#d8c18d] bg-[#fffdf8] p-5 sm:p-7 md:p-9"
                >
                  <h3 className="font-serif text-xl text-[#211d16] sm:text-2xl md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-[#6f685c] sm:text-base sm:leading-8">
                    {item.text}
                  </p>
                  {item.points.length > 0 && (
                    <ul className="mt-6 grid gap-3 md:grid-cols-2">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-7 text-[#4f493f]"
                        >
                          <Check className="mt-1 h-4 w-4 shrink-0 text-[#b88a2a]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
