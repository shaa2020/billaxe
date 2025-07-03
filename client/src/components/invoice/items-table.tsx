import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, List } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  vatPercent: string;
  total: string;
}

interface ItemsTableProps {
  items: InvoiceItem[];
  currency: string;
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: string) => void;
  onRemoveItem: (id: string) => void;
}

export function ItemsTable({ items, currency, onAddItem, onUpdateItem, onRemoveItem }: ItemsTableProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <List className="mr-2 text-blue-600" size={20} />
          Items & Services
        </h3>
        <Button
          onClick={onAddItem}
          className="bg-blue-600 hover:bg-blue-700 text-white no-print"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-600">Description</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-600 w-20">Qty</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-600 w-24">Rate</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-600 w-20">VAT%</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-600 w-24">Amount</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-600 w-12 no-print">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-4 py-3">
                  <Input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    placeholder="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateItem(item.id, 'quantity', e.target.value)}
                    className="w-full text-center border-gray-300 dark:border-gray-600"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={(e) => onUpdateItem(item.id, 'rate', e.target.value)}
                    className="w-full text-right border-gray-300 dark:border-gray-600"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    placeholder="0"
                    value={item.vatPercent}
                    onChange={(e) => onUpdateItem(item.id, 'vatPercent', e.target.value)}
                    className="w-full text-center border-gray-300 dark:border-gray-600"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                  {formatCurrency(parseFloat(item.total) || 0, currency)}
                </td>
                <td className="px-4 py-3 text-center no-print">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
