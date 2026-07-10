import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { quotes, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { renderToBuffer, Document, Page, Text, View, Image, StyleSheet, Font } from "@react-pdf/renderer";
import type { QuoteItem } from "@/lib/quote";
import { itemAmount } from "@/lib/quote";

export const runtime = "nodejs";

Font.register({
  family: "NanumGothic",
  fonts: [
    { src: "https://raw.githubusercontent.com/google/fonts/main/ofl/nanumgothic/NanumGothic-Regular.ttf" },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/nanumgothic/NanumGothic-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

const COLOR = {
  blue: "#1d4ed8",
  blueDark: "#1e3a8a",
  blueLight: "#eff6ff",
  border: "#e2e8f0",
  gray: "#64748b",
  dark: "#0f172a",
  rowAlt: "#f8fafc",
};

const SERVICE_AREAS = "파주·고양·일산·은평·마포·김포·강서";

const styles = StyleSheet.create({
  page: { fontFamily: "NanumGothic", fontSize: 9.5, padding: 40, paddingBottom: 60, color: COLOR.dark },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 14,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.blue,
  },
  logo: { width: 110, height: 30, objectFit: "contain" },
  headerRight: { alignItems: "flex-end" },
  docTitle: { fontSize: 24, fontWeight: 700, color: COLOR.blue },
  docSubtitle: { fontSize: 8.5, color: COLOR.gray, marginTop: 3 },

  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, gap: 12 },
  infoBox: { width: "48%" },
  infoBoxTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: COLOR.blue,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  infoLine: { flexDirection: "row", marginBottom: 3 },
  infoLabel: { width: 56, color: COLOR.gray },
  infoValue: { flex: 1 },

  metaBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLOR.blueLight,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  metaLeft: { flexDirection: "row", gap: 20 },
  metaLabel: { fontSize: 8, color: COLOR.gray },
  metaValue: { fontSize: 10.5, fontWeight: 700, marginTop: 2, color: COLOR.dark },
  metaTotalLabel: { fontSize: 9, color: COLOR.blueDark },
  metaTotalValue: { fontSize: 17, fontWeight: 700, color: COLOR.blue, marginTop: 2 },

  table: { borderWidth: 1, borderColor: COLOR.border },
  tableHeaderRow: { flexDirection: "row", backgroundColor: COLOR.blueDark },
  tableHeaderCell: { color: "#ffffff", fontSize: 8.5, fontWeight: 700, padding: 7 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: COLOR.border },
  tableRowAlt: { backgroundColor: COLOR.rowAlt },
  cell: { padding: 7 },
  cellName: { width: "26%" },
  cellModel: { width: "20%" },
  cellSpec: { width: "20%" },
  cellQty: { width: "10%", textAlign: "right" },
  cellPrice: { width: "12%", textAlign: "right" },
  cellAmount: { width: "12%", textAlign: "right" },

  totals: { marginTop: 14, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", width: 220, justifyContent: "space-between", marginBottom: 4 },
  totalLabel: { color: COLOR.gray },
  grandTotalRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
  },
  grandTotalLabel: { fontSize: 12, fontWeight: 700, color: COLOR.blueDark },
  grandTotalValue: { fontSize: 13, fontWeight: 700, color: COLOR.blue },

  notesBox: {
    marginTop: 22,
    backgroundColor: COLOR.rowAlt,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 4,
    padding: 12,
  },
  notesTitle: { fontSize: 8.5, fontWeight: 700, color: COLOR.blueDark, marginBottom: 6 },
  noteLine: { fontSize: 8, color: COLOR.gray, marginBottom: 3, lineHeight: 1.4 },

  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: COLOR.gray,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
  },
});

function formatQuoteNumber(id: string, createdAt: Date) {
  const y = createdAt.getFullYear();
  const m = String(createdAt.getMonth() + 1).padStart(2, "0");
  const d = String(createdAt.getDate()).padStart(2, "0");
  return `Q-${y}${m}${d}-${id.slice(0, 6).toUpperCase()}`;
}

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

  const logoBuffer = await readFile(path.join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image has no alt prop, this isn't an HTML img */}
          <Image src={logoSrc} style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>견적서</Text>
            <Text style={styles.docSubtitle}>AI PLUS CCTV · 무인 CCTV 설치 전문</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>고객 정보</Text>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>고객명</Text>
              <Text style={styles.infoValue}>{customer.name}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>연락처</Text>
              <Text style={styles.infoValue}>{customer.phone ?? "-"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>주소</Text>
              <Text style={styles.infoValue}>{customer.address ?? "-"}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>공급자 정보</Text>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>상호</Text>
              <Text style={styles.infoValue}>AI Plus CCTV</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>문의</Text>
              <Text style={styles.infoValue}>카카오채널 &apos;AI Plus CCTV&apos;</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>지역</Text>
              <Text style={styles.infoValue}>{SERVICE_AREAS}</Text>
            </View>
          </View>
        </View>

        <View style={styles.metaBar}>
          <View style={styles.metaLeft}>
            <View>
              <Text style={styles.metaLabel}>견적번호</Text>
              <Text style={styles.metaValue}>{formatQuoteNumber(quote.id, quote.createdAt)}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>발행일</Text>
              <Text style={styles.metaValue}>{quote.createdAt.toISOString().slice(0, 10)}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.metaTotalLabel}>합계금액</Text>
            <Text style={styles.metaTotalValue}>{quote.total.toLocaleString()}원</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.cellName]}>품명</Text>
            <Text style={[styles.tableHeaderCell, styles.cellModel]}>모델명</Text>
            <Text style={[styles.tableHeaderCell, styles.cellSpec]}>규격</Text>
            <Text style={[styles.tableHeaderCell, styles.cellQty]}>수량</Text>
            <Text style={[styles.tableHeaderCell, styles.cellPrice]}>단가</Text>
            <Text style={[styles.tableHeaderCell, styles.cellAmount]}>금액</Text>
          </View>
          {items.map((item, i) => (
            <View style={i % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow} key={i}>
              <Text style={[styles.cell, styles.cellName]}>{item.name}</Text>
              <Text style={[styles.cell, styles.cellModel]}>{item.model}</Text>
              <Text style={[styles.cell, styles.cellSpec]}>{item.spec}</Text>
              <Text style={[styles.cell, styles.cellQty]}>{item.qty}</Text>
              <Text style={[styles.cell, styles.cellPrice]}>{item.unitPrice.toLocaleString()}</Text>
              <Text style={[styles.cell, styles.cellAmount]}>{itemAmount(item).toLocaleString()}</Text>
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
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>합계금액</Text>
            <Text style={styles.grandTotalValue}>{quote.total.toLocaleString()}원</Text>
          </View>
        </View>

        <View style={styles.notesBox}>
          <Text style={styles.notesTitle}>안내사항</Text>
          <Text style={styles.noteLine}>
            *본 견적은 현장 방문 전 견적이며, 현장 확인 후 상황에 따라 변동될 수 있습니다.
          </Text>
        </View>

        <Text style={styles.footer}>
          {"AI Plus CCTV · 카카오채널 'AI Plus CCTV' · " + SERVICE_AREAS}
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
