import { getLedgerSummary, getRecentLedgerEntries } from "@/lib/google-sheets";

function currentMonthLabel() {
  const monthNumber = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", month: "numeric" }).format(
      new Date(),
    ),
  );
  return `${monthNumber}월`;
}

function SummaryCard({ label, value, suffix = "원" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-md border border-black/10 dark:border-white/15 px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold">
        {value.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}

export default async function LedgerPage() {
  let summary: Awaited<ReturnType<typeof getLedgerSummary>> = [];
  let recentEntries: Awaited<ReturnType<typeof getRecentLedgerEntries>> = [];
  let error: string | null = null;

  try {
    [summary, recentEntries] = await Promise.all([getLedgerSummary(), getRecentLedgerEntries()]);
  } catch (e) {
    error = e instanceof Error ? e.message : "장부 Sheet를 불러오지 못했습니다";
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold">장부 대시보드</h1>
        <p className="text-sm text-red-500">{error}</p>
        <p className="text-sm text-gray-500">
          Google Sheet 공유 설정과 LEDGER_SHEET_ID 값을 확인해주세요.
        </p>
      </div>
    );
  }

  const thisMonth = currentMonthLabel();
  const current = summary.find((s) => s.month === thisMonth);
  const maxValue = Math.max(1, ...summary.map((s) => Math.max(s.revenue, s.totalCost)));

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-lg font-semibold">장부 대시보드</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label={`${thisMonth} 매출`} value={current?.revenue ?? 0} />
        <SummaryCard label={`${thisMonth} 총비용`} value={current?.totalCost ?? 0} />
        <SummaryCard label={`${thisMonth} 순이익`} value={current?.profit ?? 0} />
        <SummaryCard
          label={`${thisMonth} 이익률`}
          value={Math.round((current?.margin ?? 0) * 1000) / 10}
          suffix="%"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">월별 매출 vs 비용</h2>
        <div className="flex flex-col gap-2 rounded-md border border-black/10 dark:border-white/15 p-4">
          {summary.map((s) => (
            <div key={s.month} className="flex items-center gap-3 text-xs">
              <span className="w-8 text-gray-500">{s.month}</span>
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-3 bg-black/5 dark:bg-white/10 rounded">
                  <div
                    className="h-3 rounded bg-emerald-500"
                    style={{ width: `${(s.revenue / maxValue) * 100}%` }}
                  />
                </div>
                <div className="h-3 bg-black/5 dark:bg-white/10 rounded">
                  <div
                    className="h-3 rounded bg-rose-400"
                    style={{ width: `${(s.totalCost / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-24 text-right text-gray-500">
                {s.revenue.toLocaleString()} / {s.totalCost.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          <span className="text-emerald-500">■</span> 매출 &nbsp;
          <span className="text-rose-400">■</span> 비용
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">최근 거래 내역</h2>
        <div className="overflow-x-auto rounded-md border border-black/10 dark:border-white/15">
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/10 text-left">
              <tr>
                <th className="px-3 py-2">날짜</th>
                <th className="px-3 py-2">유형</th>
                <th className="px-3 py-2">상대방</th>
                <th className="px-3 py-2">품목</th>
                <th className="px-3 py-2">합계금액</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((e, i) => (
                <tr key={i} className="border-t border-black/10 dark:border-white/10">
                  <td className="px-3 py-2 text-gray-500">{e.date}</td>
                  <td className="px-3 py-2">{e.type}</td>
                  <td className="px-3 py-2">{e.counterparty}</td>
                  <td className="px-3 py-2">{e.item}</td>
                  <td className="px-3 py-2">{e.totalAmount.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">
          장부는 Google Sheet에서 직접 관리하세요. 이 화면은 조회 전용입니다.
        </p>
      </div>
    </div>
  );
}
