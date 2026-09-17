import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { partnerEnquiries } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      organizationName,
      contactPerson,
      businessCategory,
      location,
      website,
      proposedCollaboration,
      companyProfile,
      email,
      phone,
    } = body;

    if (!organizationName || !contactPerson || !businessCategory || !proposedCollaboration || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEnquiry = await db.insert(partnerEnquiries).values({
      organizationName: organizationName as string,
      contactPerson: contactPerson as string,
      businessCategory: businessCategory as string,
      location: location as string,
      website: website as string,
      proposedCollaboration: proposedCollaboration as string,
      companyProfile: companyProfile as string,
      email: email as string,
      phone: phone as string,
    }).returning();

    return NextResponse.json(
      { 
        success: true, 
        message: "Partnership enquiry submitted successfully",
        data: newEnquiry[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting partnership enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit partnership enquiry" },
      { status: 500 }
    );
  }
}
