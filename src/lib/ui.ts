export const inputClass =
  "w-full rounded-xl border border-hairline bg-canvas px-4 py-2.5 text-sm text-ink outline-none focus:border-ink [@media(pointer:coarse)]:text-base";

export const labelClass = "block text-sm font-medium text-body-strong mb-1";

export const buttonPrimaryClass =
  "rounded-xl bg-ink text-on-primary px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50";

export const buttonSecondaryClass =
  "rounded-xl border border-hairline bg-canvas text-ink px-5 py-2.5 text-sm font-semibold hover:bg-surface-card";

export const cardClass = "rounded-2xl border border-hairline bg-canvas p-6";

export const featureCardClasses = [
  "bg-brand-pink text-on-primary",
  "bg-brand-teal text-on-primary",
  "bg-brand-lavender text-ink",
  "bg-brand-peach text-ink",
  "bg-brand-ochre text-ink",
] as const;
