import { db } from "@/db";
import { customers, quotes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CustomerForm } from "../CustomerForm";
import { updateCustomer, deleteCustomer } from "../actions";
import { buttonSecondaryClass } from "@/lib/ui";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer] = await db.select().from(customers).where(eq(customers.id, id));
  if (!customer) notFound();

  const customerQuotes = await db
    .select()
    .from(quotes)
    .where(eq(quotes.customerId, id))
    .orderBy(desc(quotes.createdAt));

  const updateWithId = updateCustomer.bind(null, id);
  const deleteWithId = deleteCustomer.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{customer.name}</h1>
        <form action={deleteWithId}>
          <button type="submit" className={buttonSecondaryClass}>
            고객 삭제
          </button>
        </form>
      </div>

      <CustomerForm customer={customer} action={updateWithId} />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">견적서</h2>
          <Link href={`/quotes/new?customerId=${id}`} className="text-sm underline">
            + 이 고객 견적서 작성
          </Link>
        </div>
        {customerQuotes.length === 0 ? (
          <p className="text-sm text-gray-500">아직 견적서가 없습니다.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10 rounded-md border border-black/10 dark:border-white/15">
            {customerQuotes.map((q) => (
              <li key={q.id} className="px-3 py-2 text-sm flex items-center justify-between">
                <Link href={`/quotes/${q.id}`} className="underline">
                  {q.createdAt.toISOString().slice(0, 10)} · {q.total.toLocaleString()}원
                </Link>
                <span>{q.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
