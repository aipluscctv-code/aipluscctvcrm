import { db } from "@/db";
import { customers } from "@/db/schema";
import { QuoteItemsForm } from "../QuoteItemsForm";
import { createQuote } from "../actions";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const customerOptions = await db
    .select({ id: customers.id, name: customers.name })
    .from(customers);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">새 견적서</h1>
      <QuoteItemsForm
        customerOptions={customerOptions}
        defaultCustomerId={customerId ?? ""}
        action={createQuote}
      />
    </div>
  );
}
