import { FiCheck } from "react-icons/fi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import TeamAvatar from "@/components/TeamAvatar";
import { images, teamContent } from "@/lib/content";

export const dynamic = "force-dynamic";

const gladys = {
  name: "GLADYS ABODAKPI",
  position: "MANAGING DIRECTOR",
  bio: "Provides executive leadership and management oversight, supporting corporate growth, project delivery, stakeholder engagement and the company's commitment to quality real estate services.",
  // Exact original asset path requested by Management. No filters, generated
  // substitute, crop preprocessing, or artistic modification is applied.
  photoUrl: "/images/team/gladys-abodakpi.jpg",
};

export default function TeamPage() {
  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden">
        <PageHero
          title={teamContent.heroTitle}
          body={teamContent.heroBody}
          image={images.team}
        />

        <section className="bg-[#fcfaf5] py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-5 md:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Leadership</span>
              <h2 className="section-title">Corporate Leadership</h2>
            </div>

            <div className="mt-10 flex justify-center">
              <article className="mx-auto w-full max-w-2xl border border-[#d8c18d] bg-white p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto mb-4">
                  <TeamAvatar name={gladys.name} photoUrl={gladys.photoUrl} size="lg" />
                </div>

                <h3 className="mt-5 font-serif text-2xl leading-tight text-[#211d16] sm:text-3xl">
                  {gladys.name}
                </h3>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b88a2a] sm:text-xs">
                  {gladys.position}
                </p>
                <span className="mx-auto mt-5 block h-px w-16 bg-[#C5A25D]" />
                <p className="mx-auto mt-5 max-w-prose text-sm leading-7 text-[#6f685c] sm:text-base">
                  {gladys.bio}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-5 md:px-10">
            <div className="mx-auto max-w-3xl text-center md:mx-0 md:text-left">
              <span className="eyebrow">{teamContent.supportTitle}</span>
              <h2 className="section-title">An integrated professional support network</h2>
              <p className="section-subtitle">{teamContent.supportBody}</p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teamContent.supportItems.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 border border-[#d8c18d] bg-[#fffdf8] p-5 text-sm leading-7 text-[#4f493f]"
                >
                  <FiCheck className="mt-1 shrink-0 text-[#b88a2a]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
