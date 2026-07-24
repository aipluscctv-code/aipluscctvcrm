"use client";

import { useRef, useState } from "react";
import { importContacts } from "./actions";
import { buttonSecondaryClass } from "@/lib/ui";
import { SubmitButton } from "@/components/SubmitButton";

export function ImportForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await importContacts(formData);
      setFileName(null);
      formRef.current?.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "가져오기에 실패했습니다");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className={buttonSecondaryClass + " cursor-pointer"}>
          엑셀 파일 선택
          <input
            type="file"
            name="file"
            accept=".xlsx,.xls"
            required
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        {fileName && <span className="text-sm text-muted">{fileName}</span>}
        <SubmitButton pendingText="가져오는 중...">가져오기</SubmitButton>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <p className="text-xs text-muted">
        헤더 행에 &quot;이름/성별/나이/지역/휴대폰번호/업체명/노트&quot; 컬럼이 있어야 합니다
        (순서는 상관없음, &quot;이름&quot;만 필수).
      </p>
    </form>
  );
}
