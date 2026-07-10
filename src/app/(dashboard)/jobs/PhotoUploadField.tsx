"use client";

import { useEffect, useRef, useState } from "react";
import { buttonSecondaryClass } from "@/lib/ui";

export function PhotoUploadField({ name, max = 5 }: { name: string; max?: number }) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const formInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!formInputRef.current) return;
    const dataTransfer = new DataTransfer();
    files.forEach((f) => dataTransfer.items.add(f));
    formInputRef.current.files = dataTransfer.files;
  }, [files]);

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...picked].slice(0, max));
    e.target.value = "";
  }

  function removeAt(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => pickerRef.current?.click()}
          className={buttonSecondaryClass}
          disabled={files.length >= max}
        >
          사진 업로드
        </button>
        <span className="text-xs text-muted">
          {files.length}/{max}장 선택됨
        </span>
      </div>
      {/* iOS Safari can refuse to open the file picker on a programmatic .click() when the
          input is display:none — sr-only keeps it out of view without hiding it from the
          rendering tree, which is the documented workaround. */}
      <input
        ref={pickerRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handlePick}
      />
      <input ref={formInputRef} type="file" name={name} multiple required={files.length === 0} className="hidden" />
      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-xl border border-hairline px-3 py-1.5 text-sm"
            >
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="text-muted-soft hover:text-error shrink-0 ml-2"
                aria-label="사진 제거"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
