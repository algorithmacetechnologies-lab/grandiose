import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

/** PNG / JPG / WebP only — used for profile pictures and logos. */
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const DEFAULT_MAX_BYTES = 8 * 1024 * 1024;

type UploadOptions = {
  /** Maximum accepted file size in bytes. */
  maxBytes?: number;
  /** Restrict to raster image types (no GIF, no PDF). */
  imagesOnly?: boolean;
};

export async function saveUploadedFile(
  file: File,
  folder = "general",
  options: UploadOptions = {},
) {
  const { maxBytes = DEFAULT_MAX_BYTES, imagesOnly = false } = options;
  const allowed = imagesOnly ? IMAGE_TYPES : ALLOWED_TYPES;

  if (!allowed.has(file.type)) {
    throw new Error(
      imagesOnly
        ? "Unsupported file type. Upload a PNG, JPG or WebP image."
        : "Unsupported file type. Use JPG, PNG, WEBP, GIF or PDF.",
    );
  }

  if (file.size > maxBytes) {
    const limitMb = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
    throw new Error(`File too large. Maximum size is ${limitMb}MB.`);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = (file.name.split(".").pop() || "bin").toLowerCase();
  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "general";
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), bytes);

  return `/uploads/${safeFolder}/${fileName}`;
}

export async function saveUploadedFiles(files: File[], folder = "general") {
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await saveUploadedFile(file, folder));
  }
  return urls;
}
