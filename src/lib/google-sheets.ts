import { google } from "googleapis";

function normalizePrivateKey(raw: string | undefined) {
  if (!raw) return undefined;
  let key = raw.trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n");
}

export function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
    key: normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

export type MonthlySummaryRow = {
  month: string;
  revenue: number;
  materials: number;
  labor: number;
  overhead: number;
  totalCost: number;
  profit: number;
  margin: number;
  taxReserve: number;
};

export type LedgerEntryRow = {
  date: string;
  type: string;
  counterparty: string;
  area: string;
  phone: string;
  item: string;
  supplyAmount: number;
  vat: number;
  totalAmount: number;
  evidenceType: string;
  paymentMethod: string;
  memo: string;
};

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export async function getLedgerSummary(): Promise<MonthlySummaryRow[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.LEDGER_SHEET_ID!,
    range: "월별요약!A4:I16",
  });
  const rows = res.data.values ?? [];
  return rows
    .filter((r) => r[0])
    .map((r) => ({
      month: String(r[0] ?? ""),
      revenue: toNumber(r[1]),
      materials: toNumber(r[2]),
      labor: toNumber(r[3]),
      overhead: toNumber(r[4]),
      totalCost: toNumber(r[5]),
      profit: toNumber(r[6]),
      margin: toNumber(r[7]),
      taxReserve: toNumber(r[8]),
    }));
}

export async function getRecentLedgerEntries(limit = 15): Promise<LedgerEntryRow[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.LEDGER_SHEET_ID!,
    range: "거래장부!A4:L499",
  });
  const rows = (res.data.values ?? []).filter((r) => r[0]);
  return rows
    .slice(-limit)
    .reverse()
    .map((r) => ({
      date: String(r[0] ?? ""),
      type: String(r[1] ?? ""),
      counterparty: String(r[2] ?? ""),
      area: String(r[3] ?? ""),
      phone: String(r[4] ?? ""),
      item: String(r[5] ?? ""),
      supplyAmount: toNumber(r[6]),
      vat: toNumber(r[7]),
      totalAmount: toNumber(r[8]),
      evidenceType: String(r[9] ?? ""),
      paymentMethod: String(r[10] ?? ""),
      memo: String(r[11] ?? ""),
    }));
}
