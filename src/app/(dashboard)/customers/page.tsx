import Link from "next/link";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { buttonPrimaryClass } from "@/lib/ui";

export default async function CustomersPage() {
  const rows = await db.select().from(customers).orderBy(desc(customers.createdAt));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">고객 관리</h1>
        <Link href="/customers/new" className={buttonPrimaryClass}>
          + 새 고객
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">아직 등록된 고객이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-black/10 dark:border-white/15">
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/10 text-left">
              <tr>
                <th className="px-3 py-2">이름</th>
                <th className="px-3 py-2">연락처</th>
                <th className="px-3 py-2">지역</th>
                <th className="px-3 py-2">채널</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2">등록일</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <td className="px-3 py-2">
                    <Link href={`/customers/${c.id}`} className="font-medium underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{c.phone ?? "-"}</td>
                  <td className="px-3 py-2">{c.serviceArea ?? "-"}</td>
                  <td className="px-3 py-2">{c.channel ?? "-"}</td>
                  <td className="px-3 py-2">{c.status}</td>
                  <td className="px-3 py-2 text-gray-500">
                    {c.createdAt.toISOString().slice(0, 10)}
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
