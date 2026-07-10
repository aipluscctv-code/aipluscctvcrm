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
      {isPending ? (
        "..."
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      )}
    </button>
  );
}
