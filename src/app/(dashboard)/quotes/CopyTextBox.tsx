"use client";

import { useState } from "react";
import { buttonSecondaryClass } from "@/lib/ui";

export function CopyTextBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        readOnly
        value={text}
        rows={10}
        className="w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm font-mono"
      />
      <button type="button" onClick={handleCopy} className={buttonSecondaryClass + " self-start"}>
        {copied ? "복사됨!" : "텍스트 복사 (카톡/문자용)"}
      </button>
    </div>
  );
}
