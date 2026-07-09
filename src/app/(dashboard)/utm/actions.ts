"use server";

import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateShortCode } from "@/lib/short-link";
import { appendShortLinkRecord } from "@/lib/google-sheets";

export async function createShortLink(formData: FormData) {
  const destinationUrl = String(formData.get("destinationUrl") ?? "").trim();
  const channelLabel = String(formData.get("channelLabel") ?? "").trim() || null;
  const utmSource = String(formData.get("utmSource") ?? "").trim() || null;
  const utmMedium = String(formData.get("utmMedium") ?? "").trim() || null;
  const utmCampaign = String(formData.get("utmCampaign") ?? "").trim() || null;

  if (!destinationUrl) {
    throw new Error("목적지 URL은 필수입니다");
  }
  new URL(destinationUrl);

  let code = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateShortCode();
    const existing = await db
      .select({ id: shortLinks.id })
      .from(shortLinks)
      .where(eq(shortLinks.code, candidate));
    if (existing.length === 0) {
      code = candidate;
      break;
    }
  }
  if (!code) {
    throw new Error("코드 생성에 실패했습니다. 다시 시도해주세요");
  }

  const createdAt = new Date();
  await db.insert(shortLinks).values({
    code,
    destinationUrl,
    utmSource,
    utmMedium,
    utmCampaign,
    channelLabel,
    createdAt,
  });

  await appendShortLinkRecord({
    code,
    channelLabel,
    utmSource,
    utmMedium,
    utmCampaign,
    destinationUrl,
    createdAt,
  });

  revalidatePath("/utm");
}
