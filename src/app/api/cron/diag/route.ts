import { createHash } from "crypto";
import { getSheetsClient } from "@/lib/google-sheets";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "";
  const keyFingerprint = {
    length: rawKey.length,
    sha256_12: createHash("sha256").update(rawKey).digest("hex").slice(0, 12),
    startsWithQuote: rawKey.startsWith('"'),
    endsWithQuote: rawKey.endsWith('"'),
    startsWithBeginMarker: rawKey.trim().replace(/^"/, "").startsWith("-----BEGIN PRIVATE KEY-----"),
    endsWithEndMarker: rawKey
      .trim()
      .replace(/"$/, "")
      .trim()
      .endsWith("-----END PRIVATE KEY-----"),
    containsLiteralBackslashN: rawKey.includes("\\n"),
    containsRealNewline: rawKey.includes("\n"),
  };

  const result: { ledgerSheet: string; utmSheet: string; keyFingerprint: typeof keyFingerprint } = {
    ledgerSheet: "unknown",
    utmSheet: "unknown",
    keyFingerprint,
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
