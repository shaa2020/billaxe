import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { v4 as uuidv4 } from 'uuid';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  vatPercent: string;
  total: string;
}

interface InvoiceData {
  invoiceNumber: string;
  companyName: string;
  companyTagline: string;
  companyLogo?: string;
  fromName: string;
  fromAddress: string;
  fromEmail: string;
  fromPhone: string;
  fromVAT: string;
  toName: string;
  toAddress: string;
  toEmail: string;
  toPhone: string;
  toVAT: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  paymentTerms: string;
  paymentInstructions?: string;
  invoiceNotes?: string;
  items: InvoiceItem[];
}

const defaultItem = (): InvoiceItem => ({
  id: uuidv4(),
  description: "",
  quantity: "1",
  rate: "0.00",
  vatPercent: "0",
  total: "0.00",
});

const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}${day}-${random}`;
};

const getDefaultDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

const defaultInvoiceData: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  companyName: "",
  companyTagline: "",
  fromName: "",
  fromAddress: "",
  fromEmail: "",
  fromPhone: "",
  fromVAT: "",
  toName: "",
  toAddress: "",
  toEmail: "",
  toPhone: "",
  toVAT: "",
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: getDefaultDueDate(),
  currency: "USD",
  paymentTerms: "net30",
  paymentInstructions: "",
  invoiceNotes: "",
  items: [defaultItem()],
};

export function useInvoice() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem('currentInvoice');
    return saved ? JSON.parse(saved) : defaultInvoiceData;
  });

  // Auto-save to localStorage
  const saveToLocalStorage = (data: InvoiceData) => {
    localStorage.setItem('currentInvoice', JSON.stringify(data));
  };

  const updateInvoiceData = (updates: Partial<InvoiceData>) => {
    setInvoiceData(prev => {
      const newData = { ...prev, ...updates };
      saveToLocalStorage(newData);
      return newData;
    });
  };

  const calculateItemTotal = (quantity: string, rate: string, vatPercent: string) => {
    const qty = parseFloat(quantity) || 0;
    const rateNum = parseFloat(rate) || 0;
    const vat = parseFloat(vatPercent) || 0;
    const subtotal = qty * rateNum;
    const vatAmount = subtotal * (vat / 100);
    return (subtotal + vatAmount).toFixed(2);
  };

  const addItem = () => {
    const newItem = defaultItem();
    updateInvoiceData({
      items: [...invoiceData.items, newItem]
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total when quantity, rate, or VAT changes
        if (field === 'quantity' || field === 'rate' || field === 'vatPercent') {
          updatedItem.total = calculateItemTotal(
            field === 'quantity' ? value : item.quantity,
            field === 'rate' ? value : item.rate,
            field === 'vatPercent' ? value : item.vatPercent
          );
        }
        
        return updatedItem;
      }
      return item;
    });

    updateInvoiceData({ items: updatedItems });
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      updateInvoiceData({
        items: invoiceData.items.filter(item => item.id !== id)
      });
    }
  };

  const clearInvoice = () => {
    const clearedData = {
      ...defaultInvoiceData,
      invoiceNumber: generateInvoiceNumber(),
      items: [defaultItem()],
    };
    setInvoiceData(clearedData);
    localStorage.removeItem('currentInvoice');
  };

  // Calculate totals
  const { subtotal, vatTotal, grandTotal } = useMemo(() => {
    let subtotalCalc = 0;
    let vatTotalCalc = 0;

    invoiceData.items.forEach(item => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const vatPercent = parseFloat(item.vatPercent) || 0;
      
      const itemSubtotal = qty * rate;
      const itemVat = itemSubtotal * (vatPercent / 100);
      
      subtotalCalc += itemSubtotal;
      vatTotalCalc += itemVat;
    });

    return {
      subtotal: subtotalCalc,
      vatTotal: vatTotalCalc,
      grandTotal: subtotalCalc + vatTotalCalc,
    };
  }, [invoiceData.items]);

  const saveInvoice = useMutation({
    mutationFn: async () => {
      const invoicePayload = {
        ...invoiceData,
        subtotal: subtotal.toFixed(2),
        vatTotal: vatTotal.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
      };
      
      return await apiRequest('POST', '/api/invoices', invoicePayload);
    },
  });

  return {
    invoiceData,
    updateInvoiceData,
    addItem,
    updateItem,
    removeItem,
    clearInvoice,
    saveInvoice,
    subtotal,
    vatTotal,
    grandTotal,
  };
}
