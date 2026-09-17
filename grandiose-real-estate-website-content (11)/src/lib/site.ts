import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings, type SiteSettings } from "@/db/schema";

export const defaultSiteSettings = {
  id: 1,
  siteName: "GRANDIOSE REAL ESTATE LTD",
  siteSubtitle: "Real Estate Ltd",
  tagline: "Building Communities. Creating Value. Delivering Excellence.",
  countryYear: "Ghana | 2026",
  website: "www.grandiosegh.com",
  officeAddress: "GE-155-1898, Mensah Anteh Avenue, Kwabenya Hills, Accra, Ghana",
  postalAddress: "P.O. Box LT 143, Laterbiokoshie, Accra, Ghana",
  contactEmail: "grandioseestate@gmail.com",
  contactPhone: "+233 24 948 8135 / 0302 918 303",
  whatsappNumber: "+233249488135",
  heroEyebrow: "Ghana | 2026 · www.grandiosegh.com",
  heroHeadline:
    "Your Trusted Partner in Real Estate Development, Construction and Property Solutions",
  heroSubcopy:
    "Grandiose Real Estate Ltd is a Ghanaian incorporated real estate development and construction company providing integrated solutions across the property value chain. Our work spans land acquisition and sales, residential and commercial property development, smart housing, civil engineering, estate infrastructure, renovations, property management, real estate consultancy, and the import and supply of building and construction materials.",
  heroImageUrl:
    "https://images.pexels.com/photos/28681441/pexels-photo-28681441.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000",
  ctaPrimaryLabel: "Explore Properties",
  ctaPrimaryHref: "/properties",
  ctaSecondaryLabel: "List Your Property",
  ctaSecondaryHref: "/list-property",
  ctaTertiaryLabel: "Speak With Grandiose",
  ctaTertiaryHref: "/contact",
  statsProperties: "49+",
  statsPortfolioValue: "GHS 38.55m+",
  statsSatisfaction: "90%+",
  statsQuality: "100%",
  inspectionFee: "GHS 300",
  salesCommission: "5% of final agreed sale price",
  rentalCommission: "10%",
  footerBlurb:
    "Grandiose Real Estate Ltd is a Ghanaian real estate development and construction company providing land acquisition and sales, housing development, civil engineering, renovations, property management, consultancy and building-material supply services.",
};

export async function ensureSiteSettings() {
  const existing = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  if (existing[0]) return existing[0];
  const [created] = await db.insert(siteSettings).values(defaultSiteSettings).returning();
  return created;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return ensureSiteSettings();
}
