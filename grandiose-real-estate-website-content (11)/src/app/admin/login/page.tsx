import AdminLoginClient from "./LoginClient";

export const metadata = {
  title: "Admin Login · Grandiose Real Estate Ltd",
  robots: { index: false, follow: false },
};

/**
 * Rendered as a plain server component so the full login screen (including the
 * official logo) is present in the initial HTML with no Suspense fallback.
 */
export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
