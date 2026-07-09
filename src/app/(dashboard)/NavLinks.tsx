"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/customers", label: "고객" },
  { href: "/quotes", label: "견적서" },
  { href: "/jobs", label: "시공사진" },
  { href: "/ledger", label: "장부" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 text-sm">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "font-semibold text-black dark:text-white border-b-2 border-black dark:border-white pb-1"
                : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white pb-1 border-b-2 border-transparent"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
