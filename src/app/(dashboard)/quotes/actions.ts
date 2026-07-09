"use server";

import { db } from "@/db";
import { customers, quotes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { computeTotals, formatQuoteText, type QuoteItem } from "@/lib/quote";

export async function createQuote(formData: FormData) {
  const customerId = String(formData.get("customerId") ?? "");
  const itemsRaw = String(formData.get("items") ?? "[]");
  const items: QuoteItem[] = JSON.parse(itemsRaw).filter((i: QuoteItem) => i.name);

  if (!customerId) throw new Error("고객을 선택해주세요");
  if (items.length === 0) throw new Error("품목을 1개 이상 입력해주세요");

  const [customer] = await db.select().from(customers).where(eq(customers.id, customerId));
  if (!customer) throw new Error("고객을 찾을 수 없습니다");

  const { subtotal, vat, total } = computeTotals(items);
  const textCopy = formatQuoteText({ customerName: customer.name, items, subtotal, vat, total });

  const [row] = await db
    .insert(quotes)
    .values({
      customerId,
      items,
      subtotal,
      vat,
      total,
      textCopy,
      status: "발송후대기",
      sentAt: new Date(),
    })
    .returning({ id: quotes.id });

  revalidatePath("/quotes");
  revalidatePath(`/customers/${customerId}`);
  redirect(`/quotes/${row.id}`);
}

export async function updateQuoteStatus(id: string, status: string) {
  await db
    .update(quotes)
    .set({ status: status as (typeof quotes.$inferInsert)["status"] })
    .where(eq(quotes.id, id));
  revalidatePath(`/quotes/${id}`);
  revalidatePath("/quotes");
}

export async function deleteQuote(id: string) {
  const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
  await db.delete(quotes).where(eq(quotes.id, id));
  revalidatePath("/quotes");
  if (quote) revalidatePath(`/customers/${quote.customerId}`);
  redirect("/quotes");
}
