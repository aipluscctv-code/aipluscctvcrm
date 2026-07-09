import { db } from "@/db";
import { jobs } from "@/db/schema";
import { and, lt, sql } from "drizzle-orm";
import { createAdminStorageClient } from "@/lib/supabase/admin-storage";

const BUCKET = "job-photos";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const expired = await db
    .select({ id: jobs.id, photoUrls: jobs.photoUrls })
    .from(jobs)
    .where(
      and(
        lt(jobs.photoExpiresAt, new Date()),
        sql`jsonb_array_length(${jobs.photoUrls}) > 0`,
      ),
    );

  const supabase = createAdminStorageClient();
  let cleaned = 0;

  for (const job of expired) {
    const paths = job.photoUrls as string[];
    if (paths.length > 0) {
      await supabase.storage.from(BUCKET).remove(paths);
    }
    await db.update(jobs).set({ photoUrls: [] }).where(sql`${jobs.id} = ${job.id}`);
    cleaned++;
  }

  return Response.json({ cleaned });
}
