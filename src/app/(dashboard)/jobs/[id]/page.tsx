import { db } from "@/db";
import { jobs, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CopyTextBox } from "../../quotes/CopyTextBox";
import { deleteJob, regenerateJobContent } from "../actions";
import { buttonPrimaryClass, buttonSecondaryClass } from "@/lib/ui";
import type { ChannelContent } from "@/lib/ai-content";

const BUCKET = "job-photos";

function isChannelContent(value: unknown): value is ChannelContent {
  return (
    !!value &&
    typeof value === "object" &&
    "danggeun" in value &&
    "soomgo" in value &&
    "blog" in value
  );
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db
    .select({ job: jobs, customer: customers })
    .from(jobs)
    .innerJoin(customers, eq(jobs.customerId, customers.id))
    .where(eq(jobs.id, id));

  if (!row) notFound();
  const { job, customer } = row;

  const supabase = await createClient();
  const photoPaths = job.photoUrls as string[];
  const photoUrls = await Promise.all(
    photoPaths.map(async (path) => {
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 600);
      return data?.signedUrl ?? null;
    }),
  );

  const removeJob = deleteJob.bind(null, id);
  const regenerate = async () => {
    "use server";
    await regenerateJobContent(id);
  };

  const content = job.generatedContent;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink">{customer.name} 시공 건</h1>
          <p className="text-sm text-muted">
            {job.installDate ?? "시공일 미기재"} · 상태: {job.status}
          </p>
        </div>
        <form action={removeJob}>
          <button type="submit" className={buttonSecondaryClass}>
            삭제
          </button>
        </form>
      </div>

      {job.notes && <p className="text-sm text-body">{job.notes}</p>}

      {photoUrls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {photoUrls.map((url, i) =>
            url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`시공 사진 ${i + 1}`}
                className="h-32 w-32 object-cover rounded-xl border border-hairline"
              />
            ) : null,
          )}
        </div>
      )}
      {photoPaths.length === 0 && (
        <p className="text-sm text-muted">
          사진 보관 기간(3개월)이 지나 원본 사진은 삭제되었습니다. 아래 생성된 문구는 계속
          보관됩니다.
        </p>
      )}

      {isChannelContent(content) && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-semibold mb-2">당근마켓용</h2>
            <CopyTextBox text={content.danggeun} />
          </div>
          <div>
            <h2 className="font-semibold mb-2">숨고용</h2>
            <CopyTextBox text={content.soomgo} />
          </div>
          <div>
            <h2 className="font-semibold mb-2">네이버 블로그용</h2>
            <CopyTextBox text={content.blog} />
          </div>
        </div>
      )}

      {job.status === "실패" && (
        <div className="flex flex-col gap-2 rounded-2xl border border-error/30 bg-error/10 p-3 text-sm">
          <p>콘텐츠 생성에 실패했습니다.</p>
          <form action={regenerate}>
            <button type="submit" className={buttonPrimaryClass}>
              다시 생성
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
