import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = process.env.AUTH_COOKIE_NAME ?? "__app_auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) {
    // Middleware sudah menambahkan ?next, jadi cukup redirect polos.
    redirect("/login");
  }
  return <>{children}</>;
}
