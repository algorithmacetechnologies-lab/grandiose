import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { properties, propertyListings } from "@/db/schema";
import {
  asBoolean,
  asInteger,
  asString,
  asStringArray,
  jsonError,
  jsonOk,
  readJson,
} from "@/lib/admin";
import { requireApiSession } from "@/lib/auth";

export async function GET() {
  const { error } = await requireApiSession();
  if (error) return error;
  const rows = await db.select().from(propertyListings).orderBy(desc(propertyListings.createdAt));
  return jsonOk(rows);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;

  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");

  const payload = body as Record<string, unknown>;
  const id = asInteger(payload.id);
  if (!id) return jsonError("Submission id is required");

  const existingRows = await db
    .select()
    .from(propertyListings)
    .where(eq(propertyListings.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) return jsonError("Submission not found", 404);

  const nextStatus = asString(payload.status, existing.status || "pending") || "pending";
  const inspectionFeePaid = asBoolean(payload.inspectionFeePaid, Boolean(existing.inspectionFeePaid));

  let convertedPropertyId = existing.convertedPropertyId;

  if (nextStatus === "approved" && !convertedPropertyId) {
    const photos = asStringArray(existing.photographs);
    const [created] = await db
      .insert(properties)
      .values({
        title: `${existing.propertyType} in ${existing.location}`,
        referenceNumber: `SUB-${existing.id}-${Date.now().toString().slice(-5)}`,
        description: existing.description,
        type: existing.propertyType,
        category:
          existing.propertyType.toLowerCase().includes("land")
            ? "Residential Land"
            : existing.propertyType.toLowerCase().includes("commercial")
              ? "Commercial Properties"
              : "Houses for Sale",
        location: existing.location,
        price: existing.askingPrice,
        currency: existing.currency || "GHS",
        landSize: existing.landSize,
        floorArea: existing.floorArea,
        amenities: existing.keyFeatures,
        status: "available",
        isFeatured: false,
        images: photos,
        videoUrl: existing.videoUrl,
        sitePlanUrl: existing.sitePlanUrl,
      })
      .returning();
    convertedPropertyId = created.id;
  }

  const [row] = await db
    .update(propertyListings)
    .set({
      status: nextStatus,
      inspectionFeePaid,
      convertedPropertyId,
    })
    .where(eq(propertyListings.id, id))
    .returning();

  return jsonOk(row);
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  const id = asInteger(body?.id ?? request.nextUrl.searchParams.get("id"));
  if (!id) return jsonError("Submission id is required");
  const [row] = await db.delete(propertyListings).where(eq(propertyListings.id, id)).returning();
  if (!row) return jsonError("Submission not found", 404);
  return jsonOk({ success: true, id });
}
