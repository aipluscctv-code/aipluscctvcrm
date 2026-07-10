import Link from "next/link";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { buttonPrimaryClass } from "@/lib/ui";

export default async function JobsPage() {
  const rows = await db
    .select({
      id: jobs.id,
      customerName: jobs.customerName,
      installDate: jobs.installDate,
      status: jobs.status,
      createdAt: jobs.createdAt,
    })
    .from(jobs)
    .orderBy(desc(jobs.createdAt));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">시공 사진 → SNS 콘텐츠</h1>
        <Link href="/jobs/new" className={buttonPrimaryClass}>
          + 새 시공 건 등록
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted">아직 등록된 시공 건이 없습니다.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-hairline">
            <table className="w-full text-sm">
              <thead className="bg-surface-card text-left">
                <tr>
                  <th className="px-3 py-2">고객</th>
                  <th className="px-3 py-2">시공일</th>
                  <th className="px-3 py-2">상태</th>
                  <th className="px-3 py-2">등록일</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j) => (
                  <tr key={j.id} className="border-t border-hairline hover:bg-surface-soft">
                    <td className="px-3 py-2">
                      <Link href={`/jobs/${j.id}`} className="underline font-medium">
                        {j.customerName}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{j.installDate ?? "-"}</td>
                    <td className="px-3 py-2">{j.status}</td>
                    <td className="px-3 py-2 text-muted">
                      {j.createdAt.toISOString().slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 md:hidden">
            {rows.map((j) => (
              <Link
                key={j.id}
                href={`/jobs/${j.id}`}
                className="rounded-2xl border border-hairline p-4 flex flex-col gap-1"
              >
                <span className="font-medium underline">{j.customerName}</span>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                  <span>시공일: {j.installDate ?? "-"}</span>
                  <span>상태: {j.status}</span>
                  <span>등록일: {j.createdAt.toISOString().slice(0, 10)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
