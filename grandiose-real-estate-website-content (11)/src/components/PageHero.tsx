import { assetPath } from "@/lib/assets";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  body: string;
  image: string;
  actions?: React.ReactNode;
};

export default function PageHero({
  eyebrow = "Grandiose Real Estate Ltd",
  title,
  body,
  image,
  actions,
}: PageHeroProps) {
  return (
    <section className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
      <img src={assetPath(image)} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
      <div className="relative mx-auto flex min-h-[420px] max-w-[1240px] items-end px-4 py-16 sm:px-5 md:min-h-[520px] md:px-10 md:py-24">
        <div className="max-w-4xl text-white">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e6cb8d]">
            {eyebrow}
          </span>
          <h1 className="text-3xl font-medium leading-[1.12] sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/80 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            {body}
          </p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
