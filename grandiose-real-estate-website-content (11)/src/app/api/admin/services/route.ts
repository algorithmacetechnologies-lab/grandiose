import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import {
  asBoolean,
  asInteger,
  asString,
  jsonError,
  jsonOk,
  readJson,
} from "@/lib/admin";
import { requireApiSession } from "@/lib/auth";
import { SERVICE_ICONS } from "@/components/ServiceIcon";

function mapService(body: Record<string, unknown>) {
  const title = asString(body.title);
  const description = asString(body.description);
  if (!title || !description) return null;

  const requestedIcon = asString(body.icon, "ShoppingBag") || "ShoppingBag";
  const icon = SERVICE_ICONS[requestedIcon] ? requestedIcon : "ShoppingBag";

  return {
    title,
    description,
    icon,
    order: asInteger(body.order, 0) ?? 0,
    isActive: asBoolean(body.isActive, true),
    updatedAt: new Date(),
  };
}

export async function GET() {
  const { error } = await requireApiSession();
  if (error) return error;
  const rows = await db.select().from(services).orderBy(services.order, services.id);
  return jsonOk(rows);
}

export async function POST(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;

  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");

  const values = mapService(body as Record<string, unknown>);
  if (!values) return jsonError("Title and description are required");

  const [row] = await db.insert(services).values(values).returning();
  return jsonOk(row, 201);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;

  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");

  const payload = body as Record<string, unknown>;
  const id = asInteger(payload.id);
  if (!id) return jsonError("Service id is required");

  const values = mapService(payload);
  if (!values) return jsonError("Title and description are required");

  const [row] = await db.update(services).set(values).where(eq(services.id, id)).returning();
  if (!row) return jsonError("Service not found", 404);
  return jsonOk(row);
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;

  const body = await readJson(request);
  const id = asInteger(body?.id ?? request.nextUrl.searchParams.get("id"));
  if (!id) return jsonError("Service id is required");

  const [row] = await db.delete(services).where(eq(services.id, id)).returning();
  if (!row) return jsonError("Service not found", 404);
  return jsonOk({ success: true, id });
}
