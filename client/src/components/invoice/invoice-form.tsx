import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, User } from "lucide-react";

interface InvoiceFormProps {
  invoiceData: {
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
  };
  onUpdate: (data: Partial<InvoiceFormProps['invoiceData']>) => void;
}

export function InvoiceForm({ invoiceData, onUpdate }: InvoiceFormProps) {
  return (
    <>
      {/* From/To Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* From Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Building className="mr-2 text-blue-600" size={20} />
            From
          </h3>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Company Name"
              value={invoiceData.fromName}
              onChange={(e) => onUpdate({ fromName: e.target.value })}
              className="w-full"
            />
            <Textarea
              placeholder="Company Address"
              rows={3}
              value={invoiceData.fromAddress}
              onChange={(e) => onUpdate({ fromAddress: e.target.value })}
              className="w-full"
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={invoiceData.fromEmail}
              onChange={(e) => onUpdate({ fromEmail: e.target.value })}
              className="w-full"
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={invoiceData.fromPhone}
              onChange={(e) => onUpdate({ fromPhone: e.target.value })}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="VAT Number (Optional)"
              value={invoiceData.fromVAT}
              onChange={(e) => onUpdate({ fromVAT: e.target.value })}
              className="w-full"
            />
          </div>
        </div>

        {/* To Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="mr-2 text-blue-600" size={20} />
            Bill To
          </h3>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Client Name"
              value={invoiceData.toName}
              onChange={(e) => onUpdate({ toName: e.target.value })}
              className="w-full"
            />
            <Textarea
              placeholder="Client Address"
              rows={3}
              value={invoiceData.toAddress}
              onChange={(e) => onUpdate({ toAddress: e.target.value })}
              className="w-full"
            />
            <Input
              type="email"
              placeholder="Client Email"
              value={invoiceData.toEmail}
              onChange={(e) => onUpdate({ toEmail: e.target.value })}
              className="w-full"
            />
            <Input
              type="tel"
              placeholder="Client Phone"
              value={invoiceData.toPhone}
              onChange={(e) => onUpdate({ toPhone: e.target.value })}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Client VAT Number (Optional)"
              value={invoiceData.toVAT}
              onChange={(e) => onUpdate({ toVAT: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Date</label>
          <Input
            type="date"
            value={invoiceData.invoiceDate}
            onChange={(e) => onUpdate({ invoiceDate: e.target.value })}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
          <Input
            type="date"
            value={invoiceData.dueDate}
            onChange={(e) => onUpdate({ dueDate: e.target.value })}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
          <Select value={invoiceData.currency} onValueChange={(value) => onUpdate({ currency: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">$ USD</SelectItem>
              <SelectItem value="EUR">€ EUR</SelectItem>
              <SelectItem value="GBP">£ GBP</SelectItem>
              <SelectItem value="CAD">$ CAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Terms</label>
          <Select value={invoiceData.paymentTerms} onValueChange={(value) => onUpdate({ paymentTerms: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net30">Net 30</SelectItem>
              <SelectItem value="net15">Net 15</SelectItem>
              <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
              <SelectItem value="net60">Net 60</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
