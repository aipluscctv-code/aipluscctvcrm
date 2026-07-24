import Link from "next/link";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { inputClass, labelClass, buttonPrimaryClass, buttonSecondaryClass } from "@/lib/ui";
import { maskPhone } from "@/lib/phone";
import { ImportForm } from "./ImportForm";
import { DeleteContactButton } from "./DeleteContactButton";
import { deleteContact } from "./actions";
import { Pagination } from "@/components/Pagination";
import { PAGE_SIZE_OPTIONS, parsePagination, paginate } from "@/lib/list-query";

type DbSearchParams = {
  q?: string;
  region?: string;
  gender?: string;
  minAge?: string;
  maxAge?: string;
  page?: string;
  pageSize?: string;
  full?: string;
};

export default async function DbPage({
  searchParams,
}: {
  searchParams: Promise<DbSearchParams>;
}) {
  const params = await searchParams;
  const showFull = params.full === "1";

  const rows = await db.select().from(contacts).orderBy(desc(contacts.createdAt));

  const filtered = rows.filter((c) => {
    if (params.q) {
      const q = params.q.toLowerCase();
      const match = c.name.toLowerCase().includes(q) || (c.company ?? "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (params.region && !(c.region ?? "").toLowerCase().includes(params.region.toLowerCase())) {
      return false;
    }
    if (params.gender && c.gender !== params.gender) return false;
    if (params.minAge && (c.age ?? 0) < Number(params.minAge)) return false;
    if (params.maxAge && (c.age ?? 0) > Number(params.maxAge)) return false;
    return true;
  });

  const { page, pageSize } = parsePagination(params);
  const { pageRows, totalPages } = paginate(filtered, page, pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">DB</h1>
        <div className="flex gap-2">
          <Link href="/db/new" className={buttonSecondaryClass}>
            + 새 연락처
          </Link>
          <a href="/db/export" className={buttonPrimaryClass}>
            엑셀로 내보내기
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-hairline p-4">
        <h2 className="mb-2 text-sm font-semibold text-ink">엑셀 가져오기</h2>
        <ImportForm />
      </div>

      <details className="rounded-2xl border border-hairline [&_summary::-webkit-details-marker]:hidden">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-ink">
          필터
        </summary>
        <form method="get" className="flex flex-wrap items-end gap-3 border-t border-hairline p-4">
          <div>
            <label className={labelClass}>검색어</label>
            <input
              type="text"
              name="q"
              placeholder="이름/업체명 검색"
              defaultValue={params.q}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>지역</label>
            <input
              type="text"
              name="region"
              placeholder="예: 파주"
              defaultValue={params.region}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>성별</label>
            <select name="gender" defaultValue={params.gender ?? ""} className={inputClass}>
              <option value="">전체</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>최소 나이</label>
            <input
              type="number"
              name="minAge"
              min={0}
              defaultValue={params.minAge}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>최대 나이</label>
            <input
              type="number"
              name="maxAge"
              min={0}
              defaultValue={params.maxAge}
              className={inputClass}
            />
          </div>
          <button type="submit" className={buttonPrimaryClass}>
            필터 적용
          </button>
          <a href="/db" className={buttonSecondaryClass}>
            초기화
          </a>
        </form>
      </details>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">등록된 연락처가 없습니다.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-hairline">
            <table className="w-full text-sm">
              <thead className="bg-surface-card text-left">
                <tr>
                  <th className="px-3 py-2">이름</th>
                  <th className="px-3 py-2">성별</th>
                  <th className="px-3 py-2">나이</th>
                  <th className="px-3 py-2">지역</th>
                  <th className="px-3 py-2">휴대폰번호</th>
                  <th className="px-3 py-2">업체명</th>
                  <th className="px-3 py-2">노트</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((c) => (
                  <tr key={c.id} className="border-t border-hairline hover:bg-surface-soft">
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2">{c.gender ?? "-"}</td>
                    <td className="px-3 py-2">{c.age ?? "-"}</td>
                    <td className="px-3 py-2">{c.region ?? "-"}</td>
                    <td className="px-3 py-2">{showFull ? c.phone ?? "-" : maskPhone(c.phone)}</td>
                    <td className="px-3 py-2">{c.company ?? "-"}</td>
                    <td className="px-3 py-2 max-w-[200px] truncate">{c.notes ?? "-"}</td>
                    <td className="px-3 py-2 text-right">
                      <DeleteContactButton action={deleteContact.bind(null, c.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            basePath="/db"
            searchParams={params}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </>
      )}

      <div className="pt-2 text-right">
        <Link href={buildToggleFullHref(params, showFull)} className="text-xs text-muted-soft hover:text-muted">
          {showFull ? "번호 다시 가리기" : "번호 전체보기"}
        </Link>
      </div>
    </div>
  );
}

function buildToggleFullHref(params: DbSearchParams, showFull: boolean) {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "full") next.set(key, value);
  }
  if (!showFull) next.set("full", "1");
  const qs = next.toString();
  return qs ? `/db?${qs}` : "/db";
}
