import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { NavLinks } from "./NavLinks";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-full flex flex-col">
      <header className="bg-canvas border-b border-hairline">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/customers" className="flex items-center">
              <Image src="/logo.png" alt="AI Plus CCTV" width={141} height={38} priority className="h-8 w-auto" />
            </Link>
            <NavLinks />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>{user?.email}</span>
            <form action={signOut}>
              <button type="submit" className="underline hover:text-ink">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 bg-canvas">{children}</main>
    </div>
  );
}
