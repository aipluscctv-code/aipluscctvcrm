import type { ReactNode } from "react";

const PHOTO_MARKER = /\[사진(\d+)\](?:\s*\n\(대체텍스트:\s*([^)]*)\))?/g;

export function BlogPreview({
  text,
  photoUrls,
}: {
  text: string;
  photoUrls: (string | null)[];
}) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(PHOTO_MARKER)) {
    const before = text.slice(lastIndex, match.index);
    if (before.trim()) {
      nodes.push(
        <p key={key++} className="whitespace-pre-wrap text-sm text-body">
          {before.trim()}
        </p>,
      );
    }

    const photoNum = Number(match[1]);
    const altText = match[2]?.trim();
    const url = photoUrls[photoNum - 1];
    if (url) {
      nodes.push(
        <figure key={key++} className="flex flex-col gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={altText || `사진 ${photoNum}`}
            className="w-full max-w-md rounded-xl border border-hairline"
          />
          {altText && <figcaption className="text-xs text-muted">{altText}</figcaption>}
        </figure>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  const rest = text.slice(lastIndex);
  if (rest.trim()) {
    nodes.push(
      <p key={key++} className="whitespace-pre-wrap text-sm text-body">
        {rest.trim()}
      </p>,
    );
  }

  return <div className="rounded-2xl border border-hairline p-4 flex flex-col gap-3">{nodes}</div>;
}
