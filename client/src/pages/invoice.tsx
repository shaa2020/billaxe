import { useState } from "react";
import { InvoiceHeader } from "@/components/invoice/invoice-header";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { ItemsTable } from "@/components/invoice/items-table";
import { InvoiceTotals } from "@/components/invoice/invoice-totals";
import { TemplateModal } from "@/components/invoice/template-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInvoice } from "@/hooks/use-invoice";
import { useTemplates } from "@/hooks/use-templates";
import { generatePDF } from "@/lib/pdf-generator";
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

  const handleDownloadPDF = () => {
    const invoiceElement = document.getElementById('invoice-content');
    if (invoiceElement) {
      generatePDF(invoiceElement, `invoice-${invoiceData.invoiceNumber}.pdf`);
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
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card id="invoice-content" className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <InvoiceHeader 
            invoiceData={invoiceData}
            onUpdate={updateInvoiceData}
          />
          
          <div className="p-8">
            <InvoiceForm 
              invoiceData={invoiceData}
              onUpdate={updateInvoiceData}
            />
            
            <ItemsTable 
              items={invoiceData.items}
              currency={invoiceData.currency}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
            
            <InvoiceTotals 
              subtotal={subtotal}
              vatTotal={vatTotal}
              grandTotal={grandTotal}
              currency={invoiceData.currency}
            />

            {/* Notes Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Save className="mr-2 text-blue-600" size={16} />
                  Payment Instructions
                </h4>
                <textarea 
                  value={invoiceData.paymentInstructions || ''}
                  onChange={(e) => updateInvoiceData({ paymentInstructions: e.target.value })}
                  rows={6} 
                  placeholder="Enter payment instructions, bank details, etc."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Eye className="mr-2 text-blue-600" size={16} />
                  Notes & Comments
                </h4>
                <textarea 
                  value={invoiceData.invoiceNotes || ''}
                  onChange={(e) => updateInvoiceData({ invoiceNotes: e.target.value })}
                  rows={6} 
                  placeholder="Additional notes, terms, or comments"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-2">Terms & Conditions: Payment is due within the specified terms. Late payments may incur additional charges.</p>
                <p>This invoice was generated on {new Date().toLocaleDateString()} | {invoiceData.companyName || 'Your Company'} | All rights reserved</p>
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
