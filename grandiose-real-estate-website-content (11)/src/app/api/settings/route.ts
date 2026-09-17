import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({
    inspectionFee: settings.inspectionFee,
    salesCommission: settings.salesCommission,
    rentalCommission: settings.rentalCommission,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    officeAddress: settings.officeAddress,
    postalAddress: settings.postalAddress,
    whatsappNumber: settings.whatsappNumber,
    heroEyebrow: settings.heroEyebrow,
    heroHeadline: settings.heroHeadline,
    heroSubcopy: settings.heroSubcopy,
    heroImageUrl: settings.heroImageUrl,
    ctaPrimaryLabel: settings.ctaPrimaryLabel,
    ctaPrimaryHref: settings.ctaPrimaryHref,
    ctaSecondaryLabel: settings.ctaSecondaryLabel,
    ctaSecondaryHref: settings.ctaSecondaryHref,
    ctaTertiaryLabel: settings.ctaTertiaryLabel,
    ctaTertiaryHref: settings.ctaTertiaryHref,
    statsProperties: settings.statsProperties,
    statsPortfolioValue: settings.statsPortfolioValue,
    statsSatisfaction: settings.statsSatisfaction,
    statsQuality: settings.statsQuality,
    footerBlurb: settings.footerBlurb,
    tagline: settings.tagline,
    siteName: settings.siteName,
  });
}
