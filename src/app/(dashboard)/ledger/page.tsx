import Link from "next/link";
import { getRecentLedgerEntries } from "@/lib/google-sheets";
import { getAvailableYears, getMonthlySummary, getYearlySummary } from "@/lib/ledger-summary";
import { featureCardClasses } from "@/lib/ui";
import { Pagination } from "@/components/Pagination";
import { parsePagination, paginate, type ListSearchParams } from "@/lib/list-query";

const LEDGER_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

function currentYear() {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", year: "numeric" }).format(
      new Date(),
    ),
  );
}

function currentMonthLabel() {
  const monthNumber = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", month: "numeric" }).format(
      new Date(),
    ),
  );
  return `${monthNumber}월`;
}

const tabClass = (active: boolean) =>
  active
    ? "rounded-full bg-ink px-4 py-2 text-sm font-semibold text-on-primary"
    : "rounded-full px-4 py-2 text-sm text-muted hover:text-ink";

function SummaryCard({
  label,
  value,
  suffix = "원",
  colorClass,
}: {
  label: string;
  value: number;
  suffix?: string;
  colorClass: string;
}) {
  return (
    <div className={`rounded-3xl px-4 py-4 ${colorClass}`}>
      <p className="text-xs opacity-80 mb-1">{label}</p>
      <p className="text-lg font-semibold">
        {value.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}

type LedgerSearchParams = ListSearchParams & { view?: string; year?: string };

function buildLedgerHref(params: LedgerSearchParams, overrides: Partial<LedgerSearchParams>) {
  const next = new URLSearchParams();
  const merged = { ...params, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value && key !== "page" && key !== "pageSize") next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `/ledger?${qs}` : "/ledger";
}

export default async function LedgerPage({
  searchParams,
}: {
  searchParams: Promise<LedgerSearchParams>;
}) {
  const params = await searchParams;
  let recentEntries: Awaited<ReturnType<typeof getRecentLedgerEntries>> = [];
  let error: string | null = null;

  try {
    recentEntries = await getRecentLedgerEntries();
  } catch (e) {
    error = e instanceof Error ? e.message : "장부 Sheet를 불러오지 못했습니다";
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-ink">장부 대시보드</h1>
        <p className="text-sm text-error">{error}</p>
        <p className="text-sm text-muted">
          Google Sheet 공유 설정과 LEDGER_SHEET_ID 값을 확인해주세요.
        </p>
      </div>
    );
  }

  const view = params.view === "year" ? "year" : "month";
  const availableYears = getAvailableYears(recentEntries);
  const selectedYear = availableYears.includes(Number(params.year))
    ? Number(params.year)
    : availableYears[0] ?? currentYear();

  const periods = view === "year" ? getYearlySummary(recentEntries) : getMonthlySummary(recentEntries, selectedYear);
  const currentLabel = view === "year" ? `${selectedYear}년` : currentMonthLabel();
  const current = periods.find((p) => p.label === currentLabel) ?? periods[periods.length - 1];
  const maxValue = Math.max(1, ...periods.map((p) => Math.max(p.revenue, p.totalCost)));

  const { page, pageSize } = parsePagination(params, LEDGER_PAGE_SIZE_OPTIONS);
  const { pageRows, totalPages } = paginate(recentEntries, page, pageSize);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-ink">장부 대시보드</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-surface-card p-1">
            <Link href={buildLedgerHref(params, { view: "month" })} className={tabClass(view === "month")}>
              월별
            </Link>
            <Link href={buildLedgerHref(params, { view: "year" })} className={tabClass(view === "year")}>
              연도별
            </Link>
          </div>
          {view === "month" && availableYears.length > 0 && (
            <div className="flex items-center gap-1">
              {availableYears.map((year) => (
                <Link
                  key={year}
                  href={buildLedgerHref(params, { view: "month", year: String(year) })}
                  className={tabClass(year === selectedYear)}
                >
                  {year}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <SummaryCard
          label={`${currentLabel} 매출`}
          value={current?.revenue ?? 0}
          colorClass={featureCardClasses[0]}
        />
        <SummaryCard
          label={`${currentLabel} 총비용`}
          value={current?.totalCost ?? 0}
          colorClass={featureCardClasses[1]}
        />
        <SummaryCard
          label={`${currentLabel} 순이익`}
          value={current?.profit ?? 0}
          colorClass={featureCardClasses[2]}
        />
        <SummaryCard
          label={`${currentLabel} 이익률`}
          value={Math.round((current?.margin ?? 0) * 1000) / 10}
          suffix="%"
          colorClass={featureCardClasses[3]}
        />
        <SummaryCard
          label={`${currentLabel} 4대보험 예비비 추정 (매출×10%)`}
          value={Math.round((current?.revenue ?? 0) * 0.1)}
          colorClass={featureCardClasses[4]}
        />
      </div>
      <p className="text-xs text-muted -mt-6">
        4대보험 예비비는 매출의 10%로 보수적으로 어림잡은 값입니다 — 실제 국민연금·건강보험은
        매출이 아닌 소득(순이익) 기준으로 계산되며 개인 상황에 따라 다르니, 정확한 금액은
        국민연금공단·건강보험공단 계산기나 세무사 상담으로 확인하세요.
      </p>

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-ink">
          {view === "year" ? "연도별 매출 vs 비용" : `${selectedYear}년 월별 매출 vs 비용`}
        </h2>
        <div className="flex flex-col gap-2 rounded-2xl border border-hairline p-4">
          {periods.map((p) => (
            <div key={p.label} className="flex items-center gap-3 text-xs">
              <span className="w-10 text-muted">{p.label}</span>
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-3 bg-surface-card rounded-full">
                  <div
                    className="h-3 rounded-full bg-brand-mint"
                    style={{ width: `${(p.revenue / maxValue) * 100}%` }}
                  />
                </div>
                <div className="h-3 bg-surface-card rounded-full">
                  <div
                    className="h-3 rounded-full bg-brand-coral"
                    style={{ width: `${(p.totalCost / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-24 text-right text-muted">
                {p.revenue.toLocaleString()} / {p.totalCost.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">
          <span className="text-brand-mint">■</span> 매출 &nbsp;
          <span className="text-brand-coral">■</span> 비용
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-ink">최근 거래 내역</h2>
        <div className="overflow-x-auto rounded-2xl border border-hairline">
          <table className="w-full text-sm">
            <thead className="bg-surface-card text-left">
              <tr>
                <th className="px-3 py-2">날짜</th>
                <th className="px-3 py-2">구분</th>
                <th className="px-3 py-2">유형</th>
                <th className="px-3 py-2">상대방</th>
                <th className="px-3 py-2">품목</th>
                <th className="px-3 py-2">합계금액</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((e, i) => (
                <tr key={i} className="border-t border-hairline">
                  <td className="px-3 py-2 text-muted">{e.date}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        e.transactionType === "매출"
                          ? "bg-brand-mint text-ink"
                          : "bg-brand-coral text-on-primary"
                      }`}
                    >
                      {e.transactionType || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-2">{e.category}</td>
                  <td className="px-3 py-2">{e.counterparty}</td>
                  <td className="px-3 py-2">{e.item}</td>
                  <td className="px-3 py-2">{e.totalAmount.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentEntries.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            basePath="/ledger"
            searchParams={params}
            pageSizeOptions={LEDGER_PAGE_SIZE_OPTIONS}
          />
        )}
        <p className="text-xs text-muted">
          장부는 Google Sheet에서 직접 관리하세요. 이 화면은 조회 전용입니다.
        </p>
      </div>
    </div>
  );
}
