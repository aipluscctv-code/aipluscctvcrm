import type { LedgerEntryRow } from "./google-sheets";

export type PeriodSummary = {
  label: string;
  revenue: number;
  totalCost: number;
  profit: number;
  margin: number;
};

export function parseYearMonth(dateStr: string): { year: number; month: number } | null {
  const m = dateStr.match(/^(\d{4})-(\d{2})/);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]) };
}

export function getAvailableYears(entries: LedgerEntryRow[]): number[] {
  const years = new Set<number>();
  for (const e of entries) {
    const parsed = parseYearMonth(e.date);
    if (parsed) years.add(parsed.year);
  }
  return Array.from(years).sort((a, b) => b - a);
}

function toPeriodSummary(label: string, rows: LedgerEntryRow[]): PeriodSummary {
  let revenue = 0;
  let totalCost = 0;
  for (const r of rows) {
    if (r.transactionType === "매출") revenue += r.totalAmount;
    else if (r.transactionType === "지출") totalCost += r.totalAmount;
  }
  const profit = revenue - totalCost;
  const margin = revenue > 0 ? profit / revenue : 0;
  return { label, revenue, totalCost, profit, margin };
}

export function getMonthlySummary(entries: LedgerEntryRow[], year: number): PeriodSummary[] {
  return Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
    const rows = entries.filter((e) => {
      const parsed = parseYearMonth(e.date);
      return parsed && parsed.year === year && parsed.month === month;
    });
    return toPeriodSummary(`${month}월`, rows);
  });
}
