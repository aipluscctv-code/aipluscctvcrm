import { db } from "@/db";
import { quotes, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { QuoteItem } from "@/lib/quote";
import { itemAmount } from "@/lib/quote";

export const runtime = "nodejs";

Font.register({
  family: "NanumGothic",
  src: "https://raw.githubusercontent.com/google/fonts/main/ofl/nanumgothic/NanumGothic-Regular.ttf",
});

const styles = StyleSheet.create({
  page: { fontFamily: "NanumGothic", fontSize: 10, padding: 32 },
  title: { fontSize: 18, marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666", marginBottom: 20 },
  infoRow: { flexDirection: "row", marginBottom: 4 },
  infoLabel: { width: 80, color: "#666" },
  table: { marginTop: 16, borderWidth: 1, borderColor: "#ddd" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd" },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#f3f3f3", borderBottomWidth: 1, borderBottomColor: "#ddd" },
  cellName: { width: "26%", padding: 6 },
  cellModel: { width: "20%", padding: 6 },
  cellSpec: { width: "20%", padding: 6 },
  cellQty: { width: "10%", padding: 6, textAlign: "right" },
  cellPrice: { width: "12%", padding: 6, textAlign: "right" },
  cellAmount: { width: "12%", padding: 6, textAlign: "right" },
  totals: { marginTop: 16, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", width: 200, justifyContent: "space-between", marginBottom: 2 },
  totalLabel: { color: "#666" },
  grandTotal: { fontSize: 13, marginTop: 4 },
  footer: { marginTop: 32, fontSize: 9, color: "#666" },
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db
    .select({ quote: quotes, customer: customers })
    .from(quotes)
    .innerJoin(customers, eq(quotes.customerId, customers.id))
    .where(eq(quotes.id, id));

  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const { quote, customer } = row;
  const items = quote.items as QuoteItem[];

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>AI Plus CCTV 견적서</Text>
        <Text style={styles.subtitle}>
          {quote.createdAt.toISOString().slice(0, 10)} 발행 · 파주·고양·일산·은평·마포·김포·강서
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>고객명</Text>
          <Text>{customer.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>연락처</Text>
          <Text>{customer.phone ?? "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>주소</Text>
          <Text>{customer.address ?? "-"}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.cellName}>품명</Text>
            <Text style={styles.cellModel}>모델명</Text>
            <Text style={styles.cellSpec}>규격</Text>
            <Text style={styles.cellQty}>수량</Text>
            <Text style={styles.cellPrice}>단가</Text>
            <Text style={styles.cellAmount}>금액</Text>
          </View>
          {items.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.cellName}>{item.name}</Text>
              <Text style={styles.cellModel}>{item.model}</Text>
              <Text style={styles.cellSpec}>{item.spec}</Text>
              <Text style={styles.cellQty}>{item.qty}</Text>
              <Text style={styles.cellPrice}>{item.unitPrice.toLocaleString()}</Text>
              <Text style={styles.cellAmount}>{itemAmount(item).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>공급가액</Text>
            <Text>{quote.subtotal.toLocaleString()}원</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>부가세(10%)</Text>
            <Text>{quote.vat.toLocaleString()}원</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotal]}>합계금액</Text>
            <Text style={styles.grandTotal}>{quote.total.toLocaleString()}원</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {"AI Plus CCTV · 카카오채널 'AI Plus CCTV' · 무료 현장 방문 견적 · 본 견적은 현장 상황에 따라 변동될 수 있습니다."}
        </Text>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="quote-${id}.pdf"`,
    },
  });
}
