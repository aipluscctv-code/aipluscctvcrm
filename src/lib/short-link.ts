import { randomBytes } from "crypto";

const ALPHABET = "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateShortCode(length = 6) {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

export const CHANNEL_OPTIONS = ["당근마켓", "숨고", "네이버블로그", "카카오채널", "기타"] as const;
