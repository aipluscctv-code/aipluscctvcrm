export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export type ListSearchParams = {
  date?: string;
  q?: string;
  status?: string;
  region?: string;
  minAmount?: string;
  maxAmount?: string;
  page?: string;
  pageSize?: string;
};

export function parsePagination(
  params: ListSearchParams,
  allowedSizes: readonly number[] = PAGE_SIZE_OPTIONS,
) {
  const requestedSize = Number(params.pageSize);
  const pageSize = allowedSizes.includes(requestedSize) ? requestedSize : allowedSizes[0];
  const page = Math.max(1, Number(params.page) || 1);
  return { page, pageSize };
}

export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * pageSize;
  return {
    pageRows: rows.slice(start, start + pageSize),
    totalPages,
    page: clampedPage,
    total: rows.length,
  };
}
