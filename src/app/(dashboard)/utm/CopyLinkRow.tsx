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
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-hairline px-3 py-2 text-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-ink">{shortUrl}</span>
          {link.channelLabel && (
            <span className="rounded-full bg-surface-card px-2 py-0.5 text-xs text-body">
              {link.channelLabel}
            </span>
          )}
        </div>
        <div className="truncate text-xs text-muted mt-0.5">{link.destinationUrl}</div>
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
