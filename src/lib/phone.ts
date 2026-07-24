export function maskPhone(phone: string | null): string {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-***-${digits.slice(6)}`;
  }
  if (digits.length < 7) {
    return phone;
  }
  const headLen = Math.ceil(digits.length * 0.3);
  const tailLen = Math.ceil(digits.length * 0.3);
  return (
    digits.slice(0, headLen) +
    "*".repeat(digits.length - headLen - tailLen) +
    digits.slice(digits.length - tailLen)
  );
}
