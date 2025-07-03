import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull(),
  companyName: text("company_name").notNull(),
  companyTagline: text("company_tagline"),
  companyLogo: text("company_logo"),
  fromName: text("from_name").notNull(),
  fromAddress: text("from_address").notNull(),
  fromEmail: text("from_email").notNull(),
  fromPhone: text("from_phone"),
  fromVAT: text("from_vat"),
  toName: text("to_name").notNull(),
  toAddress: text("to_address").notNull(),
  toEmail: text("to_email").notNull(),
  toPhone: text("to_phone"),
  toVAT: text("to_vat"),
  invoiceDate: text("invoice_date").notNull(),
  dueDate: text("due_date").notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentTerms: text("payment_terms").notNull().default("net30"),
  paymentInstructions: text("payment_instructions"),
  invoiceNotes: text("invoice_notes"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default("0.00"),
  vatTotal: decimal("vat_total", { precision: 10, scale: 2 }).notNull().default("0.00"),
  grandTotal: decimal("grand_total", { precision: 10, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  vatPercent: decimal("vat_percent", { precision: 5, scale: 2 }).notNull().default("0.00"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  unitType: text("unit_type").notNull().default("item"), // "item", "hour", "day", etc.
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  companyTagline: text("company_tagline"),
  companyLogo: text("company_logo"),
  fromName: text("from_name").notNull(),
  fromAddress: text("from_address").notNull(),
  fromEmail: text("from_email").notNull(),
  fromPhone: text("from_phone"),
  fromVAT: text("from_vat"),
  currency: text("currency").notNull().default("USD"),
  paymentTerms: text("payment_terms").notNull().default("net30"),
  paymentInstructions: text("payment_instructions"),
  invoiceNotes: text("invoice_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const templateItems = pgTable("template_items", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  vatPercent: decimal("vat_percent", { precision: 5, scale: 2 }).notNull().default("0.00"),
  unitType: text("unit_type").notNull().default("item"), // "item", "hour", "day", etc.
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({
  id: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateItemSchema = createInsertSchema(templateItems).omit({
  id: true,
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type TemplateItem = typeof templateItems.$inferSelect;
export type InsertTemplateItem = z.infer<typeof insertTemplateItemSchema>;

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export interface TemplateWithItems extends Template {
  items: TemplateItem[];
}
