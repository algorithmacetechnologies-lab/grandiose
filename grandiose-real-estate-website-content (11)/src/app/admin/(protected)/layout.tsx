import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Server-side authorization guard for every CMS module.
 * Runs in addition to the request-boundary proxy guard so protected
 * screens can never render without a valid session cookie.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
