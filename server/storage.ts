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

export const storage = new MemStorage();
