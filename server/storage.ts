import { 
  invoices, 
  invoiceItems, 
  templates, 
  templateItems,
  type Invoice, 
  type InsertInvoice, 
  type InvoiceItem,
  type InsertInvoiceItem,
  type Template,
  type InsertTemplate,
  type TemplateItem,
  type InsertTemplateItem,
  type InvoiceWithItems,
  type TemplateWithItems
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Invoice operations
  createInvoice(invoice: InsertInvoice, items: InsertInvoiceItem[]): Promise<InvoiceWithItems>;
  getInvoice(id: number): Promise<InvoiceWithItems | undefined>;
  getAllInvoices(): Promise<Invoice[]>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>, items: InsertInvoiceItem[]): Promise<InvoiceWithItems>;
  deleteInvoice(id: number): Promise<boolean>;

  // Template operations
  createTemplate(template: InsertTemplate, items: InsertTemplateItem[]): Promise<TemplateWithItems>;
  getTemplate(id: number): Promise<TemplateWithItems | undefined>;
  getAllTemplates(): Promise<Template[]>;
  deleteTemplate(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private invoices: Map<number, Invoice>;
  private invoiceItems: Map<number, InvoiceItem[]>;
  private templates: Map<number, Template>;
  private templateItems: Map<number, TemplateItem[]>;
  private currentInvoiceId: number;
  private currentInvoiceItemId: number;
  private currentTemplateId: number;
  private currentTemplateItemId: number;

  constructor() {
    this.invoices = new Map();
    this.invoiceItems = new Map();
    this.templates = new Map();
    this.templateItems = new Map();
    this.currentInvoiceId = 1;
    this.currentInvoiceItemId = 1;
    this.currentTemplateId = 1;
    this.currentTemplateItemId = 1;
  }

  async createInvoice(invoiceData: InsertInvoice, itemsData: InsertInvoiceItem[]): Promise<InvoiceWithItems> {
    const id = this.currentInvoiceId++;
    const invoice: Invoice = {
      ...invoiceData,
      id,
      createdAt: new Date(),
      companyTagline: invoiceData.companyTagline || null,
      companyLogo: invoiceData.companyLogo || null,
      fromPhone: invoiceData.fromPhone || null,
      fromVAT: invoiceData.fromVAT || null,
      toPhone: invoiceData.toPhone || null,
      toVAT: invoiceData.toVAT || null,
      paymentInstructions: invoiceData.paymentInstructions || null,
      invoiceNotes: invoiceData.invoiceNotes || null,
    };

    const items: InvoiceItem[] = itemsData.map(item => ({
      ...item,
      id: this.currentInvoiceItemId++,
      invoiceId: id,
      vatPercent: item.vatPercent || "0.00",
      unitType: item.unitType || "item",
    }));

    this.invoices.set(id, invoice);
    this.invoiceItems.set(id, items);

    return { ...invoice, items };
  }

  async getInvoice(id: number): Promise<InvoiceWithItems | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;

    const items = this.invoiceItems.get(id) || [];
    return { ...invoice, items };
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async updateInvoice(id: number, invoiceData: Partial<InsertInvoice>, itemsData: InsertInvoiceItem[]): Promise<InvoiceWithItems> {
    const existingInvoice = this.invoices.get(id);
    if (!existingInvoice) {
      throw new Error('Invoice not found');
    }

    const updatedInvoice: Invoice = {
      ...existingInvoice,
      ...invoiceData,
    };

    const items: InvoiceItem[] = itemsData.map(item => ({
      ...item,
      id: this.currentInvoiceItemId++,
      invoiceId: id,
      vatPercent: item.vatPercent || "0.00",
      unitType: item.unitType || "item",
    }));

    this.invoices.set(id, updatedInvoice);
    this.invoiceItems.set(id, items);

    return { ...updatedInvoice, items };
  }

  async deleteInvoice(id: number): Promise<boolean> {
    const deleted = this.invoices.delete(id);
    this.invoiceItems.delete(id);
    return deleted;
  }

  async createTemplate(templateData: InsertTemplate, itemsData: InsertTemplateItem[]): Promise<TemplateWithItems> {
    const id = this.currentTemplateId++;
    const template: Template = {
      ...templateData,
      id,
      createdAt: new Date(),
      companyTagline: templateData.companyTagline || null,
      companyLogo: templateData.companyLogo || null,
      fromPhone: templateData.fromPhone || null,
      fromVAT: templateData.fromVAT || null,
      paymentInstructions: templateData.paymentInstructions || null,
      invoiceNotes: templateData.invoiceNotes || null,
    };

    const items: TemplateItem[] = itemsData.map(item => ({
      ...item,
      id: this.currentTemplateItemId++,
      templateId: id,
      vatPercent: item.vatPercent || "0.00",
      unitType: item.unitType || "item",
    }));

    this.templates.set(id, template);
    this.templateItems.set(id, items);

    return { ...template, items };
  }

  async getTemplate(id: number): Promise<TemplateWithItems | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const items = this.templateItems.get(id) || [];
    return { ...template, items };
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const deleted = this.templates.delete(id);
    this.templateItems.delete(id);
    return deleted;
  }
}

export class DatabaseStorage implements IStorage {
  async getInvoice(id: number): Promise<InvoiceWithItems | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    if (!invoice) return undefined;

    const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));
    return { ...invoice, items };
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(invoices.createdAt);
  }

  async createInvoice(invoiceData: InsertInvoice, itemsData: InsertInvoiceItem[]): Promise<InvoiceWithItems> {
    const [invoice] = await db
      .insert(invoices)
      .values({
        ...invoiceData,
        companyTagline: invoiceData.companyTagline || null,
        companyLogo: invoiceData.companyLogo || null,
        fromPhone: invoiceData.fromPhone || null,
        fromVAT: invoiceData.fromVAT || null,
        toPhone: invoiceData.toPhone || null,
        toVAT: invoiceData.toVAT || null,
        paymentInstructions: invoiceData.paymentInstructions || null,
        invoiceNotes: invoiceData.invoiceNotes || null,
      })
      .returning();

    const items = await db
      .insert(invoiceItems)
      .values(
        itemsData.map(item => ({
          ...item,
          invoiceId: invoice.id,
          vatPercent: item.vatPercent || "0.00",
          unitType: item.unitType || "item",
        }))
      )
      .returning();

    return { ...invoice, items };
  }

  async updateInvoice(id: number, invoiceData: Partial<InsertInvoice>, itemsData: InsertInvoiceItem[]): Promise<InvoiceWithItems> {
    const [invoice] = await db
      .update(invoices)
      .set(invoiceData)
      .where(eq(invoices.id, id))
      .returning();

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // Delete existing items and insert new ones
    await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
    
    const items = await db
      .insert(invoiceItems)
      .values(
        itemsData.map(item => ({
          ...item,
          invoiceId: id,
          vatPercent: item.vatPercent || "0.00",
          unitType: item.unitType || "item",
        }))
      )
      .returning();

    return { ...invoice, items };
  }

  async deleteInvoice(id: number): Promise<boolean> {
    await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
    const result = await db.delete(invoices).where(eq(invoices.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async createTemplate(templateData: InsertTemplate, itemsData: InsertTemplateItem[]): Promise<TemplateWithItems> {
    const [template] = await db
      .insert(templates)
      .values({
        ...templateData,
        companyTagline: templateData.companyTagline || null,
        companyLogo: templateData.companyLogo || null,
        fromPhone: templateData.fromPhone || null,
        fromVAT: templateData.fromVAT || null,
        paymentInstructions: templateData.paymentInstructions || null,
        invoiceNotes: templateData.invoiceNotes || null,
      })
      .returning();

    const items = await db
      .insert(templateItems)
      .values(
        itemsData.map(item => ({
          ...item,
          templateId: template.id,
          vatPercent: item.vatPercent || "0.00",
          unitType: item.unitType || "item",
        }))
      )
      .returning();

    return { ...template, items };
  }

  async getTemplate(id: number): Promise<TemplateWithItems | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    if (!template) return undefined;

    const items = await db.select().from(templateItems).where(eq(templateItems.templateId, id));
    return { ...template, items };
  }

  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates).orderBy(templates.createdAt);
  }

  async deleteTemplate(id: number): Promise<boolean> {
    await db.delete(templateItems).where(eq(templateItems.templateId, id));
    const result = await db.delete(templates).where(eq(templates.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
