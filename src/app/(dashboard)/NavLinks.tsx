"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { href: "/customers", label: "고객" },
  { href: "/quotes", label: "견적서" },
  { href: "/jobs", label: "시공사진" },
  { href: "/ledger", label: "장부" },
  { href: "/utm", label: "UTM 분석" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "rounded-full bg-surface-card px-4 py-2 font-semibold text-ink"
                : "rounded-full px-4 py-2 text-muted hover:text-ink"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
