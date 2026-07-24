import ExcelJS from "exceljs";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const rows = await db.select().from(contacts).orderBy(desc(contacts.createdAt));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("연락처");
  sheet.columns = [
    { header: "이름", key: "name", width: 14 },
    { header: "성별", key: "gender", width: 8 },
    { header: "나이", key: "age", width: 8 },
    { header: "지역", key: "region", width: 14 },
    { header: "휴대폰번호", key: "phone", width: 16 },
    { header: "업체명", key: "company", width: 18 },
    { header: "노트", key: "notes", width: 30 },
  ];
  sheet.getRow(1).font = { bold: true };
  for (const r of rows) {
    sheet.addRow({
      name: r.name,
      gender: r.gender ?? "",
      age: r.age ?? "",
      region: r.region ?? "",
      phone: r.phone ?? "",
      company: r.company ?? "",
      notes: r.notes ?? "",
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const today = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="contacts-${today}.xlsx"`,
    },
  });
}
