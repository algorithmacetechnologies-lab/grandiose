import Link from "next/link";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { Property } from "@/db/schema";
import { images } from "@/lib/content";
import { assetPath } from "@/lib/assets";

interface PropertyCardProps {
  property: Property;
}

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

function resolveImage(property: Property) {
  const value = property.images as unknown;
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) return String(parsed[0]);
    } catch {
      if (value.startsWith("http")) return value;
    }
  }
  return fallbackImages[(property.id - 1) % fallbackImages.length];
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const image = resolveImage(property);
  const status = property.status || "available";

  return (
    <article className="property-card group">
      <Link href={`/properties/${property.id}`} className="block overflow-hidden">
        <div className="relative h-[310px] overflow-hidden">
          <img
            src={assetPath(image)}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute left-5 top-5 bg-[#fcfaf5] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#765615]">
            {status}
          </span>
          {property.isFeatured ? (
            <span className="absolute right-5 top-5 border border-[#e6cb8d] bg-[#765615]/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
              Featured
            </span>
          ) : null}
        </div>
      </Link>
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
          <span>{property.type}</span>
          <span>{property.referenceNumber}</span>
        </div>
        <h3 className="text-2xl font-medium leading-tight text-[#211d16]">{property.title}</h3>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#6f685c]">
          <FiMapPin className="text-[#b88a2a]" /> {property.location}
        </p>
        <div className="mt-6 flex items-end justify-between border-t border-[#d8c18d] pt-5">
          <div>
            <span className="block text-[9px] uppercase tracking-[0.18em] text-[#80786c]">
              Asking price
            </span>
            <strong className="mt-1 block font-serif text-xl font-semibold text-[#765615]">
              {formatCurrency(property.price, property.currency)}
            </strong>
          </div>
          <Link
            href={`/properties/${property.id}`}
            aria-label={`View ${property.title}`}
            className="grid h-10 w-10 place-items-center border border-[#b88a2a] text-[#765615] transition hover:bg-[#765615] hover:text-white"
          >
            <FiArrowUpRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
