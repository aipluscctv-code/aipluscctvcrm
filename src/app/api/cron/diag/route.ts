import { getSheetsClient } from "@/lib/google-sheets";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result: { ledgerSheet: string; utmSheet: string } = {
    ledgerSheet: "unknown",
    utmSheet: "unknown",
  };

  const sheets = getSheetsClient();

  try {
    await sheets.spreadsheets.get({ spreadsheetId: process.env.LEDGER_SHEET_ID! });
    result.ledgerSheet = "ok";
  } catch (err) {
    result.ledgerSheet = err instanceof Error ? err.message : String(err);
  }

  try {
    await sheets.spreadsheets.get({ spreadsheetId: process.env.UTM_SHEET_ID! });
    result.utmSheet = "ok";
  } catch (err) {
    result.utmSheet = err instanceof Error ? err.message : String(err);
  }

  return Response.json(result);
}
