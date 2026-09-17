import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
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

function mapTeam(body: Record<string, unknown>) {
  const name = asString(body.name);
  const position = asString(body.position);
  if (!name || !position) return null;
  return {
    name,
    position,
    bio: asOptionalString(body.bio),
    photoUrl: asOptionalString(body.photoUrl),
    email: asOptionalString(body.email),
    phone: asOptionalString(body.phone),
    order: asInteger(body.order, 0) ?? 0,
    isActive: asBoolean(body.isActive, true),
  };
}

export async function GET() {
  const { error } = await requireApiSession();
  if (error) return error;
  const rows = await db.select().from(teamMembers).orderBy(teamMembers.order, teamMembers.id);
  return jsonOk(rows);
}

export async function POST(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");
  const values = mapTeam(body as Record<string, unknown>);
  if (!values) return jsonError("Name and position are required");
  const [row] = await db.insert(teamMembers).values(values).returning();
  return jsonOk(row, 201);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");
  const id = asInteger((body as Record<string, unknown>).id);
  if (!id) return jsonError("Team member id is required");
  const values = mapTeam(body as Record<string, unknown>);
  if (!values) return jsonError("Name and position are required");
  const [row] = await db.update(teamMembers).set(values).where(eq(teamMembers.id, id)).returning();
  if (!row) return jsonError("Team member not found", 404);
  return jsonOk(row);
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  const id = asInteger(body?.id ?? request.nextUrl.searchParams.get("id"));
  if (!id) return jsonError("Team member id is required");
  const [row] = await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning();
  if (!row) return jsonError("Team member not found", 404);
  return jsonOk({ success: true, id });
}
