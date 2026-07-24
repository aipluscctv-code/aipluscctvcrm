import type { ReactNode } from "react";

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-ink/40 p-0 sm:p-4">
      <div className="flex h-full w-full flex-col bg-canvas sm:h-auto sm:max-h-[85vh] sm:max-w-lg sm:rounded-2xl sm:border sm:border-hairline">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <h2 className="font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-11 w-11 items-center justify-center text-muted hover:text-ink"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">{children}</div>
        {footer && <div className="border-t border-hairline px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
}
