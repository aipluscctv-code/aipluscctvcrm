import { inputClass, labelClass, buttonSecondaryClass } from "@/lib/ui";
import Link from "next/link";
import type { customers } from "@/db/schema";
import { SubmitButton } from "@/components/SubmitButton";

const STATUS_OPTIONS = ["신규", "견적", "계약", "시공완료", "AS"] as const;

export function CustomerForm({
  customer,
  action,
}: {
  customer?: typeof customers.$inferSelect;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 max-w-xl">
      <div>
        <label className={labelClass}>이름 *</label>
        <input name="name" defaultValue={customer?.name} required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>전화번호</label>
        <input name="phone" defaultValue={customer?.phone ?? ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>주소</label>
        <input name="address" defaultValue={customer?.address ?? ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>지역</label>
        <input
          name="serviceArea"
          defaultValue={customer?.serviceArea ?? ""}
          placeholder="예: 파주, 일산"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>유입 채널</label>
        <input
          name="channel"
          defaultValue={customer?.channel ?? ""}
          placeholder="예: 네이버블로그, 당근마켓, 숨고, 카카오채널"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>상태</label>
        <select
          name="status"
          defaultValue={customer?.status ?? "신규"}
          className={inputClass}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Google Drive 링크 (계약서 등, 선택)</label>
        <input name="driveLink" defaultValue={customer?.driveLink ?? ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>메모</label>
        <textarea
          name="notes"
          defaultValue={customer?.notes ?? ""}
          rows={4}
          className={inputClass}
        />
      </div>
      <div className="flex gap-2">
        <SubmitButton pendingText="저장 중...">저장</SubmitButton>
        <Link href="/customers" className={buttonSecondaryClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
