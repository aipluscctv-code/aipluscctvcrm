export type QuoteItem = {
  name: string;
  model: string;
  spec: string;
  qty: number;
  unitPrice: number;
};

export function itemAmount(item: QuoteItem) {
  return item.qty * item.unitPrice;
}

export function computeTotals(items: QuoteItem[]) {
  const subtotal = items.reduce((sum, item) => sum + itemAmount(item), 0);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;
  return { subtotal, vat, total };
}

const SERVICE_AREAS = "파주·고양·일산·은평·마포·김포·강서";

export function formatQuoteText({
  customerName,
  items,
  subtotal,
  vat,
  total,
}: {
  customerName: string;
  items: QuoteItem[];
  subtotal: number;
  vat: number;
  total: number;
}) {
  const itemLines = items
    .map((item, i) => {
      const spec = [item.model, item.spec].filter(Boolean).join(" / ");
      return `${i + 1}. ${item.name}${spec ? ` (${spec})` : ""} x${item.qty} = ${itemAmount(
        item,
      ).toLocaleString()}원`;
    })
    .join("\n");

  return `[AI Plus CCTV 견적서]
${customerName}님 안녕하세요 😊
견적요청해 주셔서 감사합니다.
아래와 같이 견적 공유드립니다.

${itemLines}

공급가액: ${subtotal.toLocaleString()}원
부가세: ${vat.toLocaleString()}원
합계금액: ${total.toLocaleString()}원

*본 견적은 현장 방문 전 견적이며, 현장 확인 후 상황에 따라 변동될 수 있습니다.

최선을 다해 최고의 서비스를 지원할 수 있도록 하겠습니다.
감사합니다.

서비스 지역: ${SERVICE_AREAS}
문의: 카카오채널 'AI Plus CCTV'`;
}

export const QUOTE_STATUS_OPTIONS = [
  "발송후대기",
  "견적수락",
  "계약",
  "시공완료",
  "AS",
  "거절/드롭",
  "미응답",
] as const;

export const QUOTE_STATUS_BADGE_CLASS: Record<string, string> = {
  발송후대기: "bg-brand-mint/50 text-ink",
  견적수락: "bg-brand-mint text-ink",
  계약: "bg-brand-teal/60 text-on-primary",
  시공완료: "bg-brand-teal text-on-primary",
  AS: "bg-brand-teal text-on-primary",
  "거절/드롭": "bg-surface-strong text-body",
  미응답: "bg-brand-lavender text-ink",
};

export const QUOTE_CATALOG: { category: string; items: string[] }[] = [
  {
    category: "카메라",
    items: [
      "CCTV 카메라 (실내)",
      "CCTV 카메라 (실외)",
      "IP 카메라 (실내, PoE)",
      "IP 카메라 (실외, PoE)",
      "야간컬러 카메라",
      "PTZ 스피드돔 카메라",
    ],
  },
  {
    category: "녹화장비",
    items: ["DVR 8채널", "DVR 16채널", "NVR 8채널", "NVR 16채널"],
  },
  {
    category: "저장장치",
    items: ["HDD 2TB", "HDD 4TB"],
  },
  {
    category: "전원/배선",
    items: ["CCTV 전용케이블", "전원케이블", "전원장치 (SMPS/어댑터)"],
  },
  {
    category: "부자재",
    items: ["하이박스", "PVC 몰딩", "잡자재 (커넥터/앙카 등)"],
  },
  {
    category: "시공/서비스",
    items: [
      "설치 공사비",
      "노무비",
      "네트워크 셋팅",
      "스마트폰 원격 설정",
      "모니터 벽걸이 설치",
      "층간 공사 설치비",
      "엘리베이터 공사",
      "개인정보보호법 안내판 제공",
    ],
  },
];
