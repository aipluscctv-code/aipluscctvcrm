import Link from "next/link";
import { db } from "@/db";
import { customers, quotes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { buttonPrimaryClass } from "@/lib/ui";
import { deleteCustomer } from "./actions";
import { DeleteCustomerButton } from "./DeleteCustomerButton";
import { QUOTE_STATUS_OPTIONS } from "@/lib/quote";
import { StatusBadge } from "@/components/StatusBadge";
import { ListFilters } from "@/components/ListFilters";
import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE_OPTIONS, parsePagination, paginate, type ListSearchParams } from "@/lib/list-query";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const params = await searchParams;
  const rows = await db.select().from(customers).orderBy(desc(customers.createdAt));

  const allQuotes = await db
    .select({ customerId: quotes.customerId, total: quotes.total, status: quotes.status })
    .from(quotes)
    .orderBy(desc(quotes.createdAt));
  const latestQuoteByCustomer = new Map<string, { total: number; status: string }>();
  for (const q of allQuotes) {
    if (!latestQuoteByCustomer.has(q.customerId)) {
      latestQuoteByCustomer.set(q.customerId, { total: q.total, status: q.status });
    }
  }

  const rowsWithQuote = rows.map((c) => ({
    customer: c,
    latestQuote: latestQuoteByCustomer.get(c.id) ?? null,
  }));

  const filtered = rowsWithQuote.filter(({ customer, latestQuote }) => {
    if (params.date && customer.createdAt.toISOString().slice(0, 10) !== params.date) {
      return false;
    }
    if (params.q && !customer.name.toLowerCase().includes(params.q.toLowerCase())) {
      return false;
    }
    if (params.status) {
      const status = latestQuote?.status ?? "신규";
      if (status !== params.status) return false;
    }
    if (
      params.region &&
      !(customer.serviceArea ?? "").toLowerCase().includes(params.region.toLowerCase())
    ) {
      return false;
    }
    const amount = latestQuote?.total ?? 0;
    if (params.minAmount && amount < Number(params.minAmount)) return false;
    if (params.maxAmount && amount > Number(params.maxAmount)) return false;
    return true;
  });

  const { page, pageSize } = parsePagination(params);
  const { pageRows, totalPages } = paginate(filtered, page, pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">고객 관리</h1>
        <Link href="/customers/new" className={buttonPrimaryClass}>
          + 새 고객
        </Link>
      </div>

      <ListFilters
        statusOptions={QUOTE_STATUS_OPTIONS}
        defaults={{
          date: params.date,
          q: params.q,
          status: params.status,
          region: params.region,
          minAmount: params.minAmount,
          maxAmount: params.maxAmount,
        }}
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">조건에 맞는 고객이 없습니다.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-hairline">
            <table className="w-full text-sm">
              <thead className="bg-surface-card text-left">
                <tr>
                  <th className="px-3 py-2">이름</th>
                  <th className="px-3 py-2">연락처</th>
                  <th className="px-3 py-2">지역</th>
                  <th className="px-3 py-2">채널</th>
                  <th className="px-3 py-2">상태</th>
                  <th className="px-3 py-2">최근 견적 금액</th>
                  <th className="px-3 py-2">등록일</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map(({ customer: c, latestQuote }) => (
                  <tr key={c.id} className="border-t border-hairline hover:bg-surface-soft">
                    <td className="px-3 py-2">
                      <Link href={`/customers/${c.id}`} className="font-medium underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{c.phone ?? "-"}</td>
                    <td className="px-3 py-2">{c.serviceArea ?? "-"}</td>
                    <td className="px-3 py-2">{c.channel ?? "-"}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={latestQuote?.status ?? "신규"} />
                    </td>
                    <td className="px-3 py-2">
                      {latestQuote ? `${latestQuote.total.toLocaleString()}원` : "-"}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {c.createdAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <DeleteCustomerButton action={deleteCustomer.bind(null, c.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            basePath="/customers"
            searchParams={params}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </>
      )}
    </div>
  );
}
