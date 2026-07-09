import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { getChannelSummary } from "@/lib/google-sheets";
import { createShortLink } from "./actions";
import { CopyLinkRow } from "./CopyLinkRow";
import { inputClass, labelClass } from "@/lib/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { CHANNEL_OPTIONS } from "@/lib/short-link";

export default async function UtmPage() {
  const [links, channelSummary, hdrs] = await Promise.all([
    db.select().from(shortLinks).orderBy(desc(shortLinks.createdAt)),
    getChannelSummary().catch(() => null),
    headers(),
  ]);

  const host = hdrs.get("host") ?? "";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold mb-4">UTM 분석</h1>
        {channelSummary === null ? (
          <p className="text-sm text-red-600">
            채널별 요약을 불러오지 못했습니다. Google Sheet 공유 설정과 UTM_SHEET_ID 값을 확인해주세요.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {channelSummary.map((row) => (
              <div
                key={row.channel}
                className="rounded-md border border-black/10 dark:border-white/15 px-3 py-3"
              >
                <div className="text-xs text-gray-500">{row.channel}</div>
                <div className="text-2xl font-semibold mt-1">{row.clicks}</div>
                <div className="text-xs text-gray-400 mt-1">클릭수</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">단축링크 발급</h2>
        <form action={createShortLink} className="flex flex-col gap-4 max-w-xl">
          <div>
            <label className={labelClass}>목적지 URL *</label>
            <input
              name="destinationUrl"
              required
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>채널</label>
            <select name="channelLabel" defaultValue={CHANNEL_OPTIONS[0]} className={inputClass}>
              {CHANNEL_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>utm_source</label>
              <input name="utmSource" className={inputClass} placeholder="danggeun" />
            </div>
            <div>
              <label className={labelClass}>utm_medium</label>
              <input name="utmMedium" className={inputClass} placeholder="post" />
            </div>
            <div>
              <label className={labelClass}>utm_campaign</label>
              <input name="utmCampaign" className={inputClass} placeholder="2026-07" />
            </div>
          </div>
          <SubmitButton pendingText="생성 중...">링크 생성</SubmitButton>
        </form>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">발급된 링크 ({links.length})</h2>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <CopyLinkRow key={link.id} link={link} baseUrl={baseUrl} />
          ))}
          {links.length === 0 && (
            <p className="text-sm text-gray-500">아직 발급된 링크가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
