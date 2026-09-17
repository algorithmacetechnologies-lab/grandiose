import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { asInteger, asString, jsonError, jsonOk, readJson } from "@/lib/admin";
import { requireApiSession } from "@/lib/auth";

export async function GET() {
  const { error } = await requireApiSession();
  if (error) return error;
  const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  return jsonOk(rows);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body");
  const id = asInteger((body as Record<string, unknown>).id);
  const status = asString((body as Record<string, unknown>).status);
  if (!id || !status) return jsonError("Enquiry id and status are required");
  const [row] = await db.update(enquiries).set({ status }).where(eq(enquiries.id, id)).returning();
  if (!row) return jsonError("Enquiry not found", 404);
  return jsonOk(row);
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;
  const body = await readJson(request);
  const id = asInteger(body?.id ?? request.nextUrl.searchParams.get("id"));
  if (!id) return jsonError("Enquiry id is required");
  const [row] = await db.delete(enquiries).where(eq(enquiries.id, id)).returning();
  if (!row) return jsonError("Enquiry not found", 404);
  return jsonOk({ success: true, id });
}
