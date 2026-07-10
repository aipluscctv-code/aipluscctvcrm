type SearchParamsRecord = Record<string, string | undefined>;

export function Pagination({
  page,
  totalPages,
  pageSize,
  basePath,
  searchParams,
  pageSizeOptions,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  basePath: string;
  searchParams: SearchParamsRecord;
  pageSizeOptions: readonly number[];
}) {
  function hrefFor(p: number, ps: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "page" && k !== "pageSize") params.set(k, v);
    }
    params.set("page", String(p));
    params.set("pageSize", String(ps));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 text-sm">
      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <a
            key={p}
            href={hrefFor(p, pageSize)}
            className={
              p === page
                ? "rounded-full bg-ink text-on-primary px-3 py-2"
                : "rounded-full px-3 py-2 text-muted hover:text-ink"
            }
          >
            {p}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted">페이지당</span>
        {pageSizeOptions.map((size) => (
          <a
            key={size}
            href={hrefFor(1, size)}
            className={
              size === pageSize
                ? "rounded-full bg-surface-card px-3 py-1 font-semibold text-ink"
                : "rounded-full px-3 py-1 text-muted hover:text-ink"
            }
          >
            {size}개
          </a>
        ))}
      </div>
    </div>
  );
}
