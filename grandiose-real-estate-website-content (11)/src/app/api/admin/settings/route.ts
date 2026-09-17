import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireApiSession } from "@/lib/auth";
import { ensureSiteSettings } from "@/lib/site";

export async function GET() {
  const { error } = await requireApiSession();
  if (error) return error;
  const settings = await ensureSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  // Site-wide settings are restricted to the Super Admin role (RBAC).
  const { error } = await requireApiSession("super_admin");
  if (error) return error;

  try {
    const body = await request.json();
    await ensureSiteSettings();
    const [updated] = await db
      .update(siteSettings)
      .set({
        siteName: String(body.siteName || ""),
        siteSubtitle: String(body.siteSubtitle || ""),
        tagline: String(body.tagline || ""),
        countryYear: String(body.countryYear || ""),
        website: String(body.website || ""),
        officeAddress: String(body.officeAddress || ""),
        postalAddress: String(body.postalAddress || ""),
        contactEmail: String(body.contactEmail || ""),
        contactPhone: String(body.contactPhone || ""),
        whatsappNumber: String(body.whatsappNumber || ""),
        heroEyebrow: String(body.heroEyebrow || ""),
        heroHeadline: String(body.heroHeadline || ""),
        heroSubcopy: String(body.heroSubcopy || ""),
        heroImageUrl: body.heroImageUrl || null,
        ctaPrimaryLabel: String(body.ctaPrimaryLabel || ""),
        ctaPrimaryHref: String(body.ctaPrimaryHref || ""),
        ctaSecondaryLabel: String(body.ctaSecondaryLabel || ""),
        ctaSecondaryHref: String(body.ctaSecondaryHref || ""),
        ctaTertiaryLabel: String(body.ctaTertiaryLabel || ""),
        ctaTertiaryHref: String(body.ctaTertiaryHref || ""),
        statsProperties: String(body.statsProperties || ""),
        statsPortfolioValue: String(body.statsPortfolioValue || ""),
        statsSatisfaction: String(body.statsSatisfaction || ""),
        statsQuality: String(body.statsQuality || ""),
        inspectionFee: String(body.inspectionFee || ""),
        salesCommission: String(body.salesCommission || ""),
        rentalCommission: String(body.rentalCommission || ""),
        footerBlurb: String(body.footerBlurb || ""),
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, 1))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
