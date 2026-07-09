"use client";

import { useFormStatus } from "react-dom";
import { buttonPrimaryClass } from "@/lib/ui";

export function SubmitButton({
  children,
  pendingText,
  className,
}: {
  children: React.ReactNode;
  pendingText: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className ?? buttonPrimaryClass}>
      {pending ? pendingText : children}
    </button>
  );
}
