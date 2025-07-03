import { formatCurrency } from "@/lib/currency";

interface InvoiceTotalsProps {
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  currency: string;
}

export function InvoiceTotals({ subtotal, vatTotal, grandTotal, currency }: InvoiceTotalsProps) {
  return (
    <div className="flex justify-end mb-8">
      <div className="w-full max-w-sm">
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">VAT Total:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(vatTotal, currency)}</span>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total:</span>
              <span>{formatCurrency(grandTotal, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
