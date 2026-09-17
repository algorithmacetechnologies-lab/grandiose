"use client";

import { useEffect, useState } from "react";
import { assetPath } from "@/lib/assets";

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "GR"
  );
}

/**
 * Leadership portrait with a Grandiose gold border.
 * The source image is rendered directly without filters or transformations.
 * If a file is unavailable at runtime, initials are shown instead of a broken
 * image icon; the original source path remains unchanged.
 */
export default function TeamAvatar({
  name,
  photoUrl,
  size = "md",
}: {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [photoUrl]);

  const dimensions =
    size === "lg"
      ? "h-36 w-36 md:h-44 md:w-44"
      : size === "sm"
        ? "h-16 w-16"
        : "h-24 w-24 sm:h-28 sm:w-28";

  const text =
    size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : "text-2xl sm:text-3xl";

  return (
    <div
      className={`mx-auto shrink-0 overflow-hidden rounded-full border-4 border-[#C5A25D] bg-[#f6efdf] p-1 shadow-sm ${dimensions}`}
    >
      {photoUrl && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assetPath(photoUrl)}
          alt={name}
          width={176}
          height={176}
          className="h-full w-full rounded-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={`grid h-full w-full place-items-center rounded-full bg-[#f6efdf] font-serif font-semibold text-[#765615] ${text}`}
          aria-label={`${name} profile photograph unavailable`}
        >
          {initialsOf(name)}
        </div>
      )}
    </div>
  );
}
