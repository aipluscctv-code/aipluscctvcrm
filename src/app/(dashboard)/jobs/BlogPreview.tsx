const PHOTO_MARKER = /\[사진(\d+)\]/g;

export function BlogPreview({
  text,
  photoUrls,
}: {
  text: string;
  photoUrls: (string | null)[];
}) {
  const parts = text.split(PHOTO_MARKER);

  return (
    <div className="rounded-2xl border border-hairline p-4 flex flex-col gap-3">
      {parts.map((part, i) => {
        // Odd indices are the captured photo numbers from the split regex.
        if (i % 2 === 1) {
          const url = photoUrls[Number(part) - 1];
          if (!url) return null;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`사진 ${part}`}
              className="w-full max-w-md rounded-xl border border-hairline"
            />
          );
        }
        return part ? (
          <p key={i} className="whitespace-pre-wrap text-sm text-body">
            {part}
          </p>
        ) : null;
      })}
    </div>
  );
}
