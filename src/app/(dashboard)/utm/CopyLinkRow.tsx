"use client";

import { useState } from "react";
import { buttonSecondaryClass } from "@/lib/ui";
import type { shortLinks } from "@/db/schema";

export function CopyLinkRow({
  link,
  baseUrl,
}: {
  link: typeof shortLinks.$inferSelect;
  baseUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `${baseUrl}/r/${link.code}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-black/10 dark:border-white/15 px-3 py-2 text-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono">{shortUrl}</span>
          {link.channelLabel && (
            <span className="rounded bg-black/5 dark:bg-white/10 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">
              {link.channelLabel}
            </span>
          )}
        </div>
        <div className="truncate text-xs text-gray-500 mt-0.5">{link.destinationUrl}</div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={buttonSecondaryClass + " shrink-0"}
      >
        {copied ? "복사됨!" : "복사"}
      </button>
    </div>
  );
}
