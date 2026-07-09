"use server";

import { db } from "@/db";
import { jobs, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { compressImage } from "@/lib/image";
import { generateJobContent } from "@/lib/ai-content";

const BUCKET = "job-photos";
const MAX_PHOTOS = 5;
const RETENTION_DAYS = 90;

export async function createJob(formData: FormData) {
  const customerId = String(formData.get("customerId") ?? "");
  const installDate = String(formData.get("installDate") ?? "") || null;
  const notes = String(formData.get("notes") ?? "").trim();
  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (!customerId) throw new Error("고객을 선택해주세요");
  if (photos.length === 0) throw new Error("사진을 1장 이상 올려주세요");
  if (photos.length > MAX_PHOTOS) throw new Error(`사진은 최대 ${MAX_PHOTOS}장까지 가능합니다`);

  const [customer] = await db.select().from(customers).where(eq(customers.id, customerId));
  if (!customer) throw new Error("고객을 찾을 수 없습니다");

  const photoExpiresAt = new Date(Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const [job] = await db
    .insert(jobs)
    .values({
      customerId,
      installDate,
      notes,
      photoUrls: [],
      photoExpiresAt,
      status: "생성중",
    })
    .returning({ id: jobs.id });

  const supabase = await createClient();
  const compressedImages: { path: string; base64: string }[] = [];

  for (let i = 0; i < photos.length; i++) {
    const arrayBuffer = await photos[i].arrayBuffer();
    const compressed = await compressImage(Buffer.from(arrayBuffer));
    const path = `${job.id}/${i}.jpg`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
      contentType: "image/jpeg",
      upsert: true,
    });
    if (error) throw new Error(`사진 업로드 실패: ${error.message}`);

    compressedImages.push({ path, base64: compressed.toString("base64") });
  }

  await db
    .update(jobs)
    .set({ photoUrls: compressedImages.map((i) => i.path) })
    .where(eq(jobs.id, job.id));

  try {
    const content = await generateJobContent({
      customerArea: customer.serviceArea,
      jobDescription: notes,
      images: compressedImages.map((i) => ({ base64: i.base64, mediaType: "image/jpeg" })),
    });
    await db
      .update(jobs)
      .set({ generatedContent: content, status: "완료" })
      .where(eq(jobs.id, job.id));
  } catch (e) {
    await db
      .update(jobs)
      .set({
        generatedContent: { error: e instanceof Error ? e.message : "알 수 없는 오류" },
        status: "실패",
      })
      .where(eq(jobs.id, job.id));
  }

  revalidatePath("/jobs");
  redirect(`/jobs/${job.id}`);
}

export async function regenerateJobContent(jobId: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!job) throw new Error("작업을 찾을 수 없습니다");
  const [customer] = await db.select().from(customers).where(eq(customers.id, job.customerId));

  const supabase = await createClient();
  const paths = job.photoUrls as string[];
  if (paths.length === 0) {
    throw new Error("사진이 이미 삭제되어 다시 생성할 수 없습니다");
  }

  const images = await Promise.all(
    paths.map(async (path) => {
      const { data, error } = await supabase.storage.from(BUCKET).download(path);
      if (error || !data) throw new Error(`사진을 불러오지 못했습니다: ${path}`);
      const buffer = Buffer.from(await data.arrayBuffer());
      return { base64: buffer.toString("base64"), mediaType: "image/jpeg" as const };
    }),
  );

  try {
    const content = await generateJobContent({
      customerArea: customer?.serviceArea,
      jobDescription: job.notes ?? "",
      images,
    });
    await db
      .update(jobs)
      .set({ generatedContent: content, status: "완료" })
      .where(eq(jobs.id, jobId));
  } catch (e) {
    await db
      .update(jobs)
      .set({
        generatedContent: { error: e instanceof Error ? e.message : "알 수 없는 오류" },
        status: "실패",
      })
      .where(eq(jobs.id, jobId));
  }

  revalidatePath(`/jobs/${jobId}`);
}

export async function deleteJob(jobId: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (job) {
    const supabase = await createClient();
    const paths = job.photoUrls as string[];
    if (paths.length > 0) {
      await supabase.storage.from(BUCKET).remove(paths);
    }
  }
  await db.delete(jobs).where(eq(jobs.id, jobId));
  revalidatePath("/jobs");
  redirect("/jobs");
}
