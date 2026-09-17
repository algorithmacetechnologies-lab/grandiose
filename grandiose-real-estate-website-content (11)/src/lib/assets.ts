/**
 * Universal asset path resolver.
 *
 * Public files are stored canonically as root paths in the database, e.g.
 * `/images/logo.png` and `/uploads/team/photo.webp`. At render time this
 * helper adds NEXT_PUBLIC_BASE_PATH when the app is mounted below a domain
 * root (for example https://example.com/grandiose).
 *
 * Absolute HTTP(S), protocol-relative, data and blob URLs are returned
 * untouched, allowing Cloudinary/S3/Supabase/CDN media to coexist with local
 * public assets. Legacy values such as `public/images/x.jpg`,
 * `../public/images/x.jpg`, or `./images/x.jpg` are normalized safely.
 */

function normalizeBasePath(value: string | undefined) {
  const trimmed = (value || "").trim();
  if (!trimmed || trimmed === "/") return "";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

export const PUBLIC_BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const PASSTHROUGH = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

export function assetPath(source: string | null | undefined): string {
  if (!source) return "";

  const value = source.trim();
  if (!value) return "";
  if (PASSTHROUGH.test(value)) return value;

  // Normalize historical paths without allowing parent-directory traversal.
  let normalized = value
    .replace(/\\/g, "/")
    .replace(/^(?:\.\.\/)+/, "")
    .replace(/^\.\//, "")
    .replace(/^public\//i, "")
    .replace(/^\/+/, "");

  normalized = normalized
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");

  const rootPath = `/${normalized}`;
  if (!PUBLIC_BASE_PATH) return rootPath;

  // Avoid prefixing a value that was already stored with the deployment path.
  if (rootPath === PUBLIC_BASE_PATH || rootPath.startsWith(`${PUBLIC_BASE_PATH}/`)) {
    return rootPath;
  }

  return `${PUBLIC_BASE_PATH}${rootPath}`;
}

export const staticAssets = {
  logo: assetPath("/images/logo.png"),
  logoIcon: assetPath("/images/logo-icon.png"),
} as const;
