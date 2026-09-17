"use client";

import { useRef, useState } from "react";
import { FiImage, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { notify } from "@/components/admin/ui";
import { assetPath } from "@/lib/assets";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/webp";

export default function ImageUpload({
  label,
  folder,
  value,
  onChange,
  hint = "PNG, JPG or WebP · max 2MB",
  circular = false,
}: {
  label: string;
  folder: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  circular?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const shape = circular ? "rounded-full" : "rounded-sm";

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Unsupported file type. Upload a PNG, JPG or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File too large. Maximum size is 2MB.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);

      const response = await fetch(assetPath("/api/admin/upload"), { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      onChange(String(data.url));
      notify("Image uploaded");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      notify(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="form-label">{label}</span>

      <div className="mt-2 flex items-start gap-4">
        <div
          className={`grid h-24 w-24 shrink-0 place-items-center overflow-hidden border-2 border-[#C5A25D] bg-[#f6efdf] ${shape}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={assetPath(value)} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <FiImage className="text-xl text-[#b88a2a]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 border border-[#d8c18d] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#765615] transition hover:border-[#b88a2a] disabled:opacity-60"
            >
              <FiUploadCloud />
              {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
            </button>

            {value ? (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  notify("Image removed");
                }}
                className="inline-flex items-center gap-2 border border-[#d8c18d] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-400"
              >
                <FiTrash2 /> Remove
              </button>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />

          <p className="mt-2 text-xs text-[#6f685c]">{hint}</p>
          {value ? (
            <p className="mt-1 truncate text-xs text-[#8a8378]" title={value}>
              {value}
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="mt-2 text-xs font-medium text-red-700">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
