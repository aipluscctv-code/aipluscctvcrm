"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubmitButton } from "@/components/SubmitButton";
import { NAV_ITEMS } from "./NavLinks";

export function MobileMenu({
  userEmail,
  signOutAction,
}: {
  userEmail?: string;
  signOutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface-card"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18" />
            <path d="M3 12h18" />
            <path d="M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 border-t border-hairline bg-canvas px-4 py-3 flex flex-col gap-1 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "rounded-xl bg-surface-card px-4 py-3 font-semibold text-ink"
                    : "rounded-xl px-4 py-3 text-muted hover:text-ink"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 pt-3 border-t border-hairline flex items-center justify-between gap-3 px-1 text-sm text-muted">
            <span className="truncate">{userEmail}</span>
            <form action={signOutAction}>
              <SubmitButton pendingText="로그아웃 중..." className="underline hover:text-ink shrink-0">
                로그아웃
              </SubmitButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
