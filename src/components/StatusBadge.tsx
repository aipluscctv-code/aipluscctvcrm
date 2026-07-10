import { QUOTE_STATUS_BADGE_CLASS } from "@/lib/quote";

export function StatusBadge({ status }: { status: string }) {
  const colorClass = QUOTE_STATUS_BADGE_CLASS[status] ?? "bg-surface-card text-body";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorClass}`}>{status}</span>
  );
}
