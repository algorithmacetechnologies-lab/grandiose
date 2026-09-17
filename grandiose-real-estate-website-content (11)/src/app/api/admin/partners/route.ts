import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { partners } from "@/db/schema";
import {
  asBoolean,
  asInteger,
  asOptionalString,
  asString,
  jsonError,
  jsonOk,
  readJson,
} from "@/lib/admin";
import { requireApiSession } from "@/lib/auth";

function mapPartner(body: Record<string, unknown>) {
  const name = asString(body.name);
  const category = asString(body.category);
  const description = asString(body.description);
  if (!name || !category || !description) return null;
  return {
    name,
    category,
    description,
    logoUrl: asOptionalString(body.logoUrl),
    website: asOptionalString(body.website),
    contactPerson: asOptionalString(body.contactPerson),
    contactEmail: asOptionalString(body.contactEmail),
    contactPhone: asOptionalString(body.contactPhone),
    isActive: asBoolean(body.isActive, true),
    order: asInteger(body.order, 0) ?? 0,
  };
}

export async function GET() {
  const { error } = await requireApiSession();
  if (error) return error;
  const rows = await db.select().from(partners).orderBy(partners.order, partners.id);
  return jsonOk(rows);
}

export async function POST(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");
  const values = mapPartner(body as Record<string, unknown>);
  if (!values) return jsonError("Name, category and description are required");
  const [row] = await db.insert(partners).values(values).returning();
  return jsonOk(row, 201);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");
  const id = asInteger((body as Record<string, unknown>).id);
  if (!id) return jsonError("Partner id is required");
  const values = mapPartner(body as Record<string, unknown>);
  if (!values) return jsonError("Name, category and description are required");
  const [row] = await db.update(partners).set(values).where(eq(partners.id, id)).returning();
  if (!row) return jsonError("Partner not found", 404);
  return jsonOk(row);
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  const id = asInteger(body?.id ?? request.nextUrl.searchParams.get("id"));
  if (!id) return jsonError("Partner id is required");
  const [row] = await db.delete(partners).where(eq(partners.id, id)).returning();
  if (!row) return jsonError("Partner not found", 404);
  return jsonOk({ success: true, id });
}
