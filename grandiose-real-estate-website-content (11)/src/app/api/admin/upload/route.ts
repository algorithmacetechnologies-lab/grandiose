import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/media";

/** Folders that accept raster images only, with their own size caps. */
const FOLDER_RULES: Record<string, { maxBytes: number; imagesOnly: boolean }> = {
  team: { maxBytes: 2 * 1024 * 1024, imagesOnly: true },
  partners: { maxBytes: 2 * 1024 * 1024, imagesOnly: true },
  hero: { maxBytes: 6 * 1024 * 1024, imagesOnly: true },
  properties: { maxBytes: 8 * 1024 * 1024, imagesOnly: true },
  "site-plans": { maxBytes: 8 * 1024 * 1024, imagesOnly: false },
};

export async function POST(request: NextRequest) {
  const { error } = await requireApiSession();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "general");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const rules = FOLDER_RULES[folder] ?? {
      maxBytes: 8 * 1024 * 1024,
      imagesOnly: false,
    };

    const url = await saveUploadedFile(file, folder, rules);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 },
    );
  }
}
