import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      fullName,
      telephone,
      email,
      propertyOrService,
      preferredLocation,
      budgetRange,
      purpose,
      preferredDate,
      additionalInfo,
    } = body;

    if (!fullName || !telephone || !email || !propertyOrService) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEnquiry = await db.insert(enquiries).values({
      fullName,
      telephone,
      email,
      propertyOrService,
      preferredLocation,
      budgetRange,
      purpose,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      additionalInfo,
    }).returning();

    return NextResponse.json(
      { 
        success: true, 
        message: "Enquiry submitted successfully",
        data: newEnquiry[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
