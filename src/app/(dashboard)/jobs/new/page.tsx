import { createJob } from "../actions";
import { inputClass, labelClass, buttonPrimaryClass } from "@/lib/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { PhotoUploadField } from "../PhotoUploadField";

export default function NewJobPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">새 시공 건 등록</h1>
      <p className="text-sm text-muted">
        사진을 올리면 당근마켓·숨고·네이버 블로그용 문구를 자동으로 만들어드립니다. 최대
        5장까지 업로드 가능합니다.
      </p>
      <form action={createJob} className="flex flex-col gap-4 max-w-xl">
        <div>
          <label className={labelClass}>고객 *</label>
          <input name="customerName" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>시공일</label>
          <input type="date" name="installDate" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>현장 메모 (선택)</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="예: 4채널 설치, 사각지대 없이 정문·후문·창고 커버"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>시공 사진 * (최대 5장)</label>
          <PhotoUploadField name="photos" max={5} />
        </div>
        <SubmitButton
          pendingText="콘텐츠 생성 중... (최대 1분 소요)"
          className={buttonPrimaryClass + " self-start"}
        >
          콘텐츠 생성
        </SubmitButton>
      </form>
    </div>
  );
}
