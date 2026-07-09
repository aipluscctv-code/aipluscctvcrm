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
아래와 같이 견적 안내드립니다.

${itemLines}

- 공급가액: ${subtotal.toLocaleString()}원
- 부가세: ${vat.toLocaleString()}원
- 합계금액: ${total.toLocaleString()}원

서비스 지역: ${SERVICE_AREAS}
문의: 카카오채널 'AI Plus CCTV'

* 본 견적은 현장 방문 실측 결과에 따라 변동될 수 있습니다.
* 궁금하신 사항은 언제든지 편하게 연락 주세요 :)

감사합니다.`;
}
