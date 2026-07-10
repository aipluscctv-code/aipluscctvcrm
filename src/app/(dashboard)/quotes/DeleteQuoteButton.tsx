"use client";

import { useTransition } from "react";

export function DeleteQuoteButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("이 견적서를 삭제하시겠습니까?")) {
      return;
    }
    startTransition(() => {
      action();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-muted-soft hover:text-error disabled:opacity-50"
      aria-label="견적서 삭제"
    >
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
