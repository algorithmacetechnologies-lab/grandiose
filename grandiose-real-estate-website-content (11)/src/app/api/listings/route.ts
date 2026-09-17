import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { propertyListings } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      ownerName,
      ownerEmail,
      ownerPhone,
      isAgent,
      agentAuthority,
      propertyType,
      location,
      landSize,
      floorArea,
      askingPrice,
      currency,
      ownershipDetails,
      description,
      keyFeatures,
      photographs,
      videoUrl,
      sitePlanUrl,
      knownDisputes,
      encumbrances,
      preferredMarketing,
      commissionAgreement,
    } = body;

    if (!ownerName || !ownerEmail || !ownerPhone || !propertyType || !location || !askingPrice || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [row] = await db
      .insert(propertyListings)
      .values({
        ownerName: String(ownerName),
        ownerEmail: String(ownerEmail),
        ownerPhone: String(ownerPhone),
        isAgent: Boolean(isAgent),
        agentAuthority: agentAuthority ? String(agentAuthority) : null,
        propertyType: String(propertyType),
        location: String(location),
        landSize: landSize ? String(landSize) : null,
        floorArea: floorArea ? String(floorArea) : null,
        askingPrice: String(askingPrice),
        currency: currency ? String(currency) : "GHS",
        ownershipDetails: ownershipDetails ? String(ownershipDetails) : null,
        description: String(description),
        keyFeatures: keyFeatures ? String(keyFeatures) : null,
        photographs: Array.isArray(photographs) ? photographs.map(String) : [],
        videoUrl: videoUrl ? String(videoUrl) : null,
        sitePlanUrl: sitePlanUrl ? String(sitePlanUrl) : null,
        knownDisputes: knownDisputes ? String(knownDisputes) : null,
        encumbrances: encumbrances ? String(encumbrances) : null,
        preferredMarketing: preferredMarketing ? String(preferredMarketing) : null,
        commissionAgreement: commissionAgreement ? String(commissionAgreement) : null,
        inspectionFeePaid: false,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Property listing submitted successfully",
        data: row,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting property listing:", error);
    return NextResponse.json({ error: "Failed to submit property listing" }, { status: 500 });
  }
}
