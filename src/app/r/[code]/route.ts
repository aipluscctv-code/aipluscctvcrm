import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, after } from "next/server";
import { appendUtmClick } from "@/lib/google-sheets";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [link] = await db.select().from(shortLinks).where(eq(shortLinks.code, code));

  if (!link) {
    return new Response("Not found", { status: 404 });
  }

  const destination = new URL(link.destinationUrl);
  if (link.utmSource) destination.searchParams.set("utm_source", link.utmSource);
  if (link.utmMedium) destination.searchParams.set("utm_medium", link.utmMedium);
  if (link.utmCampaign) destination.searchParams.set("utm_campaign", link.utmCampaign);

  const referrer = req.headers.get("referer") ?? "";

  after(() =>
    appendUtmClick({
      code: link.code,
      channelLabel: link.channelLabel,
      utmSource: link.utmSource,
      utmMedium: link.utmMedium,
      utmCampaign: link.utmCampaign,
      destinationUrl: link.destinationUrl,
      referrer,
    }).catch((err) => console.error("Failed to log UTM click", err)),
  );

  return NextResponse.redirect(destination.toString(), { status: 302 });
}
