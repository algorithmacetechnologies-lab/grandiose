import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { properties } from "@/db/schema";
import {
  asBoolean,
  asInteger,
  asOptionalString,
  asString,
  asStringArray,
  jsonError,
  jsonOk,
  readJson,
} from "@/lib/admin";
import { requireApiSession } from "@/lib/auth";

function mapProperty(body: Record<string, unknown>) {
  const title = asString(body.title);
  const description = asString(body.description);
  const type = asString(body.type, "House") || "House";
  const location = asString(body.location);
  const price = asString(body.price);

  if (!title || !description || !location || !price) return null;

  return {
    title,
    referenceNumber: asOptionalString(body.referenceNumber),
    description,
    type,
    category: asOptionalString(body.category),
    location,
    landmarks: asOptionalString(body.landmarks),
    price,
    currency: asString(body.currency, "GHS") || "GHS",
    landSize: asOptionalString(body.landSize),
    floorArea: asOptionalString(body.floorArea),
    bedrooms: asInteger(body.bedrooms),
    bathrooms: asInteger(body.bathrooms),
    parking: asInteger(body.parking),
    amenities: asOptionalString(body.amenities),
    status: asString(body.status, "available") || "available",
    isFeatured: asBoolean(body.isFeatured, false),
    images: asStringArray(body.images),
    videoUrl: asOptionalString(body.videoUrl),
    sitePlanUrl: asOptionalString(body.sitePlanUrl),
    projectName: asOptionalString(body.projectName),
    updatedAt: new Date(),
  };
}

export async function GET() {
  const { error } = await requireApiSession();
  if (error) return error;
  const rows = await db.select().from(properties).orderBy(properties.id);
  return jsonOk(rows);
}

export async function POST(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;

  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");
  const values = mapProperty(body as Record<string, unknown>);
  if (!values) return jsonError("Title, description, location and price are required");

  const [row] = await db.insert(properties).values(values).returning();
  return jsonOk(row, 201);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;

  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");
  const id = asInteger((body as Record<string, unknown>).id);
  if (!id) return jsonError("Property id is required");

  const values = mapProperty(body as Record<string, unknown>);
  if (!values) return jsonError("Title, description, location and price are required");

  const [row] = await db.update(properties).set(values).where(eq(properties.id, id)).returning();
  if (!row) return jsonError("Property not found", 404);
  return jsonOk(row);
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;

  const body = await readJson(request);
  const id = asInteger(body?.id ?? request.nextUrl.searchParams.get("id"));
  if (!id) return jsonError("Property id is required");

  const [row] = await db.delete(properties).where(eq(properties.id, id)).returning();
  if (!row) return jsonError("Property not found", 404);
  return jsonOk({ success: true, id });
}
