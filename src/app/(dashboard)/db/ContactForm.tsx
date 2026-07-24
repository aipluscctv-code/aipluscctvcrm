import { inputClass, labelClass, buttonSecondaryClass } from "@/lib/ui";
import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";

export function ContactForm({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action} className="flex flex-col gap-4 max-w-xl">
      <div>
        <label className={labelClass}>이름 *</label>
        <input name="name" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>성별</label>
        <select name="gender" defaultValue="" className={inputClass}>
          <option value="">선택 안함</option>
          <option value="남">남</option>
          <option value="여">여</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>나이</label>
        <input type="number" name="age" min={0} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>지역</label>
        <input name="region" placeholder="예: 파주" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>휴대폰번호</label>
        <input name="phone" placeholder="010-0000-0000" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>업체명</label>
        <input name="company" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>노트</label>
        <textarea name="notes" rows={4} className={inputClass} />
      </div>
      <div className="flex gap-2">
        <SubmitButton pendingText="저장 중...">저장</SubmitButton>
        <Link href="/db" className={buttonSecondaryClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
