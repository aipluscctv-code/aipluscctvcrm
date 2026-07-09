import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const NAV_ITEMS = [
  { href: "/customers", label: "고객" },
  { href: "/quotes", label: "견적서" },
  { href: "/jobs", label: "시공사진" },
  { href: "/ledger", label: "장부" },
];

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
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/customers" className="font-semibold">
              AI Plus CCTV CRM
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{user?.email}</span>
            <form action={signOut}>
              <button type="submit" className="underline hover:text-black dark:hover:text-white">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
