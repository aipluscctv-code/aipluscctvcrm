import Link from "next/link";
import { db } from "@/db";
import { jobs, customers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { buttonPrimaryClass } from "@/lib/ui";

export default async function JobsPage() {
  const rows = await db
    .select({
      id: jobs.id,
      customerName: customers.name,
      installDate: jobs.installDate,
      status: jobs.status,
      createdAt: jobs.createdAt,
    })
    .from(jobs)
    .innerJoin(customers, eq(jobs.customerId, customers.id))
    .orderBy(desc(jobs.createdAt));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">시공 사진 → SNS 콘텐츠</h1>
        <Link href="/jobs/new" className={buttonPrimaryClass}>
          + 새 시공 건 등록
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">아직 등록된 시공 건이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-black/10 dark:border-white/15">
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/10 text-left">
              <tr>
                <th className="px-3 py-2">고객</th>
                <th className="px-3 py-2">시공일</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2">등록일</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((j) => (
                <tr
                  key={j.id}
                  className="border-t border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <td className="px-3 py-2">
                    <Link href={`/jobs/${j.id}`} className="underline font-medium">
                      {j.customerName}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{j.installDate ?? "-"}</td>
                  <td className="px-3 py-2">{j.status}</td>
                  <td className="px-3 py-2 text-gray-500">
                    {j.createdAt.toISOString().slice(0, 10)}
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
