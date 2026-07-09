import Link from "next/link";
import { db } from "@/db";
import { customers, quotes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { buttonPrimaryClass } from "@/lib/ui";
import { deleteCustomer } from "./actions";
import { DeleteCustomerButton } from "./DeleteCustomerButton";

export default async function CustomersPage() {
  const rows = await db.select().from(customers).orderBy(desc(customers.createdAt));

  const allQuotes = await db
    .select({ customerId: quotes.customerId, total: quotes.total })
    .from(quotes)
    .orderBy(desc(quotes.createdAt));
  const latestQuoteByCustomer = new Map<string, number>();
  for (const q of allQuotes) {
    if (!latestQuoteByCustomer.has(q.customerId)) {
      latestQuoteByCustomer.set(q.customerId, q.total);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">고객 관리</h1>
        <Link href="/customers/new" className={buttonPrimaryClass}>
          + 새 고객
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted">아직 등록된 고객이 없습니다.</p>
      ) : (
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
              {rows.map((c) => {
                const latestTotal = latestQuoteByCustomer.get(c.id);
                return (
                  <tr key={c.id} className="border-t border-hairline hover:bg-surface-soft">
                    <td className="px-3 py-2">
                      <Link href={`/customers/${c.id}`} className="font-medium underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{c.phone ?? "-"}</td>
                    <td className="px-3 py-2">{c.serviceArea ?? "-"}</td>
                    <td className="px-3 py-2">{c.channel ?? "-"}</td>
                    <td className="px-3 py-2">{c.status}</td>
                    <td className="px-3 py-2">
                      {latestTotal !== undefined ? `${latestTotal.toLocaleString()}원` : "-"}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {c.createdAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <DeleteCustomerButton action={deleteCustomer.bind(null, c.id)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
