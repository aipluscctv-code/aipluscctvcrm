import Link from "next/link";
import { db } from "@/db";
import { quotes, customers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function isOverdue(status: string, sentAt: Date | null) {
  if (status !== "발송후대기" || !sentAt) return false;
  return Date.now() - sentAt.getTime() > THREE_DAYS_MS;
}

export default async function QuotesPage() {
  const rows = await db
    .select({
      id: quotes.id,
      customerName: customers.name,
      total: quotes.total,
      status: quotes.status,
      sentAt: quotes.sentAt,
      createdAt: quotes.createdAt,
    })
    .from(quotes)
    .innerJoin(customers, eq(quotes.customerId, customers.id))
    .orderBy(desc(quotes.createdAt));

  const followUps = rows.filter((r) => isOverdue(r.status, r.sentAt));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">견적서</h1>

      {followUps.length > 0 && (
        <div className="rounded-2xl bg-brand-ochre px-4 py-3 text-sm text-ink">
          <p className="font-semibold mb-1">⚠ 팔로업 필요 ({followUps.length}건)</p>
          <ul className="flex flex-col gap-0.5">
            {followUps.map((q) => (
              <li key={q.id}>
                <Link href={`/quotes/${q.id}`} className="underline">
                  {q.customerName} · {q.total.toLocaleString()}원 · 발송 후 3일 경과
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-muted">아직 견적서가 없습니다. 고객 상세 페이지에서 만들어보세요.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-hairline">
          <table className="w-full text-sm">
            <thead className="bg-surface-card text-left">
              <tr>
                <th className="px-3 py-2">고객</th>
                <th className="px-3 py-2">합계금액</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2">작성일</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((q) => (
                <tr key={q.id} className="border-t border-hairline hover:bg-surface-soft">
                  <td className="px-3 py-2">
                    <Link href={`/quotes/${q.id}`} className="underline font-medium">
                      {q.customerName}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{q.total.toLocaleString()}원</td>
                  <td className="px-3 py-2">
                    {isOverdue(q.status, q.sentAt) ? "미응답 (확인필요)" : q.status}
                  </td>
                  <td className="px-3 py-2 text-muted">
                    {q.createdAt.toISOString().slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
