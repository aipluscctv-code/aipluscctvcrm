import { pgTable, uuid, text, integer, timestamp, jsonb, pgEnum, date } from "drizzle-orm/pg-core";

export const quoteStatusEnum = pgEnum("quote_status", [
  "발송후대기",
  "견적수락",
  "계약",
  "시공완료",
  "AS",
  "거절/드롭",
  "미응답",
]);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  serviceArea: text("service_area"),
  channel: text("channel"),
  driveLink: text("drive_link"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  items: jsonb("items").notNull().default([]),
  subtotal: integer("subtotal").notNull().default(0),
  vat: integer("vat").notNull().default(0),
  total: integer("total").notNull().default(0),
  status: quoteStatusEnum("status").notNull().default("발송후대기"),
  pdfUrl: text("pdf_url"),
  textCopy: text("text_copy"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: text("customer_name").notNull(),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  installDate: date("install_date"),
  notes: text("notes"),
  photoUrls: jsonb("photo_urls").notNull().default([]),
  photoExpiresAt: timestamp("photo_expires_at", { withTimezone: true }),
  generatedContent: jsonb("generated_content"),
  status: text("status").notNull().default("작성중"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shortLinks = pgTable("short_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  destinationUrl: text("destination_url").notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  channelLabel: text("channel_label"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
