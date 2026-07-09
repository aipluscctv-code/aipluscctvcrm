import { db } from "@/db";
import { quotes, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { QuoteItem } from "@/lib/quote";
import { itemAmount } from "@/lib/quote";
import { updateQuoteStatus, deleteQuote } from "../actions";
import { CopyTextBox } from "../CopyTextBox";
import { buttonPrimaryClass, buttonSecondaryClass } from "@/lib/ui";

const STATUS_OPTIONS = ["발송후대기", "수락", "거절", "미응답"] as const;

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db
    .select({ quote: quotes, customer: customers })
    .from(quotes)
    .innerJoin(customers, eq(quotes.customerId, customers.id))
    .where(eq(quotes.id, id));

  if (!row) notFound();
  const { quote, customer } = row;
  const items = quote.items as QuoteItem[];

  const setStatus = async (status: string) => {
    "use server";
    await updateQuoteStatus(id, status);
  };
  const removeQuote = deleteQuote.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink">
            <Link href={`/customers/${customer.id}`} className="underline">
              {customer.name}
            </Link>{" "}
            견적서
          </h1>
          <p className="text-sm text-muted">
            {quote.createdAt.toISOString().slice(0, 10)} 작성
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/quotes/${id}/pdf`} target="_blank" className={buttonSecondaryClass}>
            PDF 다운로드
          </a>
          <form action={removeQuote}>
            <button type="submit" className={buttonSecondaryClass}>
              삭제
            </button>
          </form>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted">상태:</span>
        {STATUS_OPTIONS.map((s) => (
          <form key={s} action={setStatus.bind(null, s)}>
            <button
              type="submit"
              className={
                quote.status === s
                  ? buttonPrimaryClass + " !px-3 !py-1"
                  : buttonSecondaryClass + " !px-3 !py-1"
              }
            >
              {s}
            </button>
          </form>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full text-sm">
          <thead className="bg-surface-card text-left">
            <tr>
              <th className="px-3 py-2">품명</th>
              <th className="px-3 py-2">모델명</th>
              <th className="px-3 py-2">규격</th>
              <th className="px-3 py-2">수량</th>
              <th className="px-3 py-2">단가</th>
              <th className="px-3 py-2">금액</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-hairline">
                <td className="px-3 py-2">{item.name}</td>
                <td className="px-3 py-2">{item.model}</td>
                <td className="px-3 py-2">{item.spec}</td>
                <td className="px-3 py-2">{item.qty}</td>
                <td className="px-3 py-2">{item.unitPrice.toLocaleString()}</td>
                <td className="px-3 py-2">{itemAmount(item).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-xs ml-auto flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">공급가액</span>
          <span>{quote.subtotal.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">부가세(10%)</span>
          <span>{quote.vat.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>합계</span>
          <span>{quote.total.toLocaleString()}원</span>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">카톡/문자용 텍스트</h2>
        <CopyTextBox text={quote.textCopy ?? ""} />
      </div>
    </div>
  );
}
