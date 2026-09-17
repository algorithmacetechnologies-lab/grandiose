import type { NextConfig } from "next";

function normalizeBasePath(value: string | undefined) {
  const trimmed = (value || "").trim();
  if (!trimmed || trimmed === "/") return "";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

/**
 * Set NEXT_PUBLIC_BASE_PATH=/grandiose when deploying below a domain root.
 * Leave it empty for normal root-domain hosting (Vercel, Netlify, cPanel
 * subdomains, Docker and traditional Node/Apache reverse proxies).
 */
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  basePath,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
