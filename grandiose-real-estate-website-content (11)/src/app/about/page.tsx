import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { aboutContent, images } from "@/lib/content";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title={aboutContent.heroTitle}
          body={aboutContent.heroBody}
          image={images.about}
          actions={
            <>
              <Link href="/services" className="btn-primary gap-2">
                View Services <FiArrowUpRight />
              </Link>
              <Link
                href="/contact"
                className="border border-[#e6cb8d] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Contact Grandiose
              </Link>
            </>
          }
        />

        <section className="bg-[#fcfaf5] py-20 md:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 md:px-10 lg:grid-cols-2">
            <div>
              <span className="eyebrow">Our Corporate Profile</span>
              <h2 className="section-title">One trusted brand across property and construction</h2>
              <p className="text-base leading-8 text-[#6f685c]">{aboutContent.profile}</p>
            </div>
            <div className="grid gap-5">
              <article className="border border-[#d8c18d] bg-white p-7">
                <h3 className="font-serif text-2xl">Our Mission</h3>
                <p className="mt-4 text-sm leading-7 text-[#6f685c]">{aboutContent.mission}</p>
              </article>
              <article className="border border-[#d8c18d] bg-white p-7">
                <h3 className="font-serif text-2xl">Our Vision</h3>
                <p className="mt-4 text-sm leading-7 text-[#6f685c]">{aboutContent.vision}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="max-w-3xl">
              <span className="eyebrow">Our Core Values</span>
              <h2 className="section-title">The standards that guide every engagement</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {aboutContent.values.map((value) => (
                <article key={value.title} className="border border-[#d8c18d] bg-[#fffdf8] p-6">
                  <h3 className="font-serif text-2xl text-[#211d16]">{value.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#6f685c]">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#d8c18d] bg-[#fcfaf5] py-20">
          <div className="mx-auto max-w-[980px] px-5 md:px-10">
            <span className="eyebrow">Our Approach</span>
            <h2 className="section-title">Commercial discipline with professional coordination</h2>
            <p className="text-base leading-8 text-[#6f685c]">{aboutContent.approach}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
