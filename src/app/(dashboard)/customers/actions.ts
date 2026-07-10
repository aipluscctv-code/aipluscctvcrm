"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function readCustomerForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    serviceArea: String(formData.get("serviceArea") ?? "").trim() || null,
    channel: String(formData.get("channel") ?? "").trim() || null,
    driveLink: String(formData.get("driveLink") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createCustomer(formData: FormData) {
  const values = readCustomerForm(formData);
  if (!values.name) {
    throw new Error("고객 이름은 필수입니다");
  }
  const [row] = await db.insert(customers).values(values).returning({ id: customers.id });
  revalidatePath("/customers");
  redirect(`/customers/${row.id}`);
}

export async function updateCustomer(id: string, formData: FormData) {
  const values = readCustomerForm(formData);
  if (!values.name) {
    throw new Error("고객 이름은 필수입니다");
  }
  await db.update(customers).set(values).where(eq(customers.id, id));
  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}

export async function deleteCustomer(id: string) {
  await db.delete(customers).where(eq(customers.id, id));
  revalidatePath("/customers");
  redirect("/customers");
}
