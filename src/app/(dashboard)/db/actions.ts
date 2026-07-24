"use server";

import ExcelJS from "exceljs";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const HEADER_ALIASES: Record<string, string[]> = {
  name: ["이름", "성명"],
  gender: ["성별"],
  age: ["나이", "연령"],
  region: ["지역"],
  phone: ["휴대폰번호", "휴대폰 번호", "전화번호", "연락처"],
  company: ["업체명", "회사명", "상호"],
  notes: ["노트", "메모", "비고"],
};

function findColumn(headerRow: string[], aliases: string[]): number {
  for (const alias of aliases) {
    const idx = headerRow.findIndex((h) => h?.trim() === alias);
    if (idx !== -1) return idx;
  }
  return -1;
}

export async function importContacts(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("엑셀 파일을 선택해주세요");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("시트를 찾을 수 없습니다");

  const headerRow = (sheet.getRow(1).values as unknown[]).map((v) => String(v ?? "").trim());
  const columns = {
    name: findColumn(headerRow, HEADER_ALIASES.name),
    gender: findColumn(headerRow, HEADER_ALIASES.gender),
    age: findColumn(headerRow, HEADER_ALIASES.age),
    region: findColumn(headerRow, HEADER_ALIASES.region),
    phone: findColumn(headerRow, HEADER_ALIASES.phone),
    company: findColumn(headerRow, HEADER_ALIASES.company),
    notes: findColumn(headerRow, HEADER_ALIASES.notes),
  };
  if (columns.name === -1) {
    throw new Error("'이름' 컬럼을 찾을 수 없습니다. 헤더 행을 확인해주세요");
  }

  const cell = (row: ExcelJS.Row, idx: number) => {
    if (idx === -1) return null;
    const v = row.getCell(idx).value;
    if (v === null || v === undefined || v === "") return null;
    return String(v).trim();
  };

  const rows: (typeof contacts.$inferInsert)[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const name = cell(row, columns.name);
    if (!name) return;
    const ageRaw = cell(row, columns.age);
    rows.push({
      name,
      gender: cell(row, columns.gender),
      age: ageRaw ? Number(ageRaw) || null : null,
      region: cell(row, columns.region),
      phone: cell(row, columns.phone),
      company: cell(row, columns.company),
      notes: cell(row, columns.notes),
    });
  });

  if (rows.length === 0) {
    throw new Error("가져올 데이터가 없습니다");
  }

  await db.insert(contacts).values(rows);
  revalidatePath("/db");
}

export async function deleteContact(id: string) {
  await db.delete(contacts).where(eq(contacts.id, id));
  revalidatePath("/db");
  redirect("/db");
}
