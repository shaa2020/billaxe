import { useState } from "react";
import { InvoiceHeader } from "@/components/invoice/invoice-header";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { ItemsTable } from "@/components/invoice/items-table";
import { InvoiceTotals } from "@/components/invoice/invoice-totals";
import { TemplateModal } from "@/components/invoice/template-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInvoice } from "@/hooks/use-invoice";
import { useTemplates } from "@/hooks/use-templates";
import { generatePDF } from "@/lib/pdf-generator";
import { formatCurrency } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Download, 
  Printer, 
  Bookmark, 
  FolderOpen, 
  Trash2, 
  Eye,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function InvoicePage() {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const {
    invoiceData,
    updateInvoiceData,
    addItem,
    updateItem,
    removeItem,
    clearInvoice,
    saveInvoice,
    subtotal,
    vatTotal,
    grandTotal
  } = useInvoice();

  const {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate
  } = useTemplates();

  const handleSaveInvoice = async () => {
    try {
      await saveInvoice.mutateAsync();
      toast({
        title: "Success",
        description: "Invoice saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    const invoiceElement = document.getElementById('invoice-content');
    if (invoiceElement) {
      // Temporarily remove max-width constraints for PDF generation
      const originalStyles = {
        maxWidth: invoiceElement.style.maxWidth,
        width: invoiceElement.style.width,
      };
      
      invoiceElement.style.maxWidth = 'none';
      invoiceElement.style.width = '210mm'; // A4 width
      
      // Wait a bit for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));
      
      generatePDF(invoiceElement, `invoice-${invoiceData.invoiceNumber}.pdf`);
      
      // Restore original styles
      invoiceElement.style.maxWidth = originalStyles.maxWidth;
      invoiceElement.style.width = originalStyles.width;
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveTemplate = async (templateName: string) => {
    try {
      await saveTemplate.mutateAsync({ name: templateName, data: invoiceData });
      toast({
        title: "Success",
        description: "Template saved successfully!",
      });
      setShowTemplateModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handleLoadTemplate = async (templateId: number) => {
    try {
      await loadTemplate.mutateAsync(templateId);
      toast({
        title: "Success",
        description: "Template loaded successfully!",
      });
      setShowTemplateModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load template",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      await deleteTemplate.mutateAsync(templateId);
      toast({
        title: "Success",
        description: "Template deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleClearInvoice = () => {
    if (confirm('Are you sure you want to clear all invoice data?')) {
      clearInvoice();
      toast({
        title: "Success",
        description: "Invoice cleared successfully!",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Save className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice Maker Pro</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Professional Invoice Generator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="no-print"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSaveInvoice}
                  disabled={saveInvoice.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  onClick={handleDownloadPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card id="invoice-content" className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          {/* Professional Header */}
          <div className="p-8 pb-0">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {invoiceData.companyName || 'ShansIT'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {invoiceData.companyTagline || 'Professional Services'}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">INVOICE</h2>
              </div>
            </div>

            {/* Invoice Details Row */}
            <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-6 mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Bill To */}
                <div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                      BILL TO:
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Input
                      type="text"
                      placeholder="Client Name"
                      value={invoiceData.toName}
                      onChange={(e) => updateInvoiceData({ toName: e.target.value })}
                      className="border-0 p-0 font-semibold text-lg focus:ring-0 bg-transparent"
                    />
                    <Input
                      type="text"
                      placeholder="Client Address"
                      value={invoiceData.toAddress}
                      onChange={(e) => updateInvoiceData({ toAddress: e.target.value })}
                      className="border-0 p-0 text-sm focus:ring-0 bg-transparent"
                    />
                    <Input
                      type="email"
                      placeholder="Client Email"
                      value={invoiceData.toEmail}
                      onChange={(e) => updateInvoiceData({ toEmail: e.target.value })}
                      className="border-0 p-0 text-sm focus:ring-0 bg-transparent"
                    />
                  </div>
                </div>

                {/* Invoice Info */}
                <div className="text-right space-y-2">
                  <div className="flex justify-end items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">NUMBER:</span>
                    <Input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => updateInvoiceData({ invoiceNumber: e.target.value })}
                      className="w-24 border-0 p-0 text-right font-medium focus:ring-0 bg-transparent"
                    />
                  </div>
                  <div className="flex justify-end items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">DATE:</span>
                    <Input
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) => updateInvoiceData({ invoiceDate: e.target.value })}
                      className="w-32 border-0 p-0 text-right font-medium focus:ring-0 bg-transparent"
                    />
                  </div>
                  <div className="flex justify-end items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">DUE DATE:</span>
                    <Input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => updateInvoiceData({ dueDate: e.target.value })}
                      className="w-32 border-0 p-0 text-right font-medium focus:ring-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-8">
            <ItemsTable 
              items={invoiceData.items}
              currency={invoiceData.currency}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
            
            {/* Totals Section */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">SUBTOTAL:</span>
                    <span className="font-medium">{formatCurrency(subtotal, invoiceData.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">VAT:</span>
                    <span className="font-medium">{formatCurrency(vatTotal, invoiceData.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">TOTAL:</span>
                    <span className="font-medium">{formatCurrency(grandTotal, invoiceData.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">PAID:</span>
                    <span className="font-medium">{formatCurrency(0, invoiceData.currency)}</span>
                  </div>
                </div>
                
                {/* Balance Due */}
                <div className="bg-gray-900 dark:bg-gray-700 text-white p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">BALANCE DUE</span>
                    <span className="text-2xl font-bold">{formatCurrency(grandTotal, invoiceData.currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions and Comments */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Payment instructions</h4>
                <textarea 
                  value={invoiceData.paymentInstructions || ''}
                  onChange={(e) => updateInvoiceData({ paymentInstructions: e.target.value })}
                  rows={4} 
                  placeholder="Enter payment instructions, bank details, etc."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Comments</h4>
                <textarea 
                  value={invoiceData.invoiceNotes || ''}
                  onChange={(e) => updateInvoiceData({ invoiceNotes: e.target.value })}
                  rows={4} 
                  placeholder="Additional notes, terms, or comments"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Panel */}
        <Card className="mt-8 bg-white dark:bg-gray-800 p-6 no-print">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline"
                onClick={() => setShowTemplateModal(true)}
                className="text-gray-600 dark:text-gray-300"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowTemplateModal(true)}
                className="text-gray-600 dark:text-gray-300"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Load Template
              </Button>
              <Button 
                variant="outline"
                onClick={handleClearInvoice}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={templates}
        onSaveTemplate={handleSaveTemplate}
        onLoadTemplate={handleLoadTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        isLoading={saveTemplate.isPending || loadTemplate.isPending || deleteTemplate.isPending}
      />
    </div>
  );
}
