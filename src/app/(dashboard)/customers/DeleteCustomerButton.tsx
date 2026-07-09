"use client";

import { useTransition } from "react";

export function DeleteCustomerButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("이 고객을 삭제하시겠습니까? 관련 견적서/시공 기록도 함께 삭제됩니다.")) {
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
      aria-label="고객 삭제"
    >
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
