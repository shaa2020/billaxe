import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, List } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  vatPercent: string;
  total: string;
  unitType: string;
}

interface ItemsTableProps {
  items: InvoiceItem[];
  currency: string;
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: string) => void;
  onRemoveItem: (id: string) => void;
}

export function ItemsTable({ items, currency, onAddItem, onUpdateItem, onRemoveItem }: ItemsTableProps) {
  const getQuantityLabel = (unitType: string) => {
    switch (unitType) {
      case 'hour':
        return 'Hours';
      case 'day':
        return 'Days';
      case 'item':
      default:
        return 'Quantity';
    }
  };

  const getUnitPriceLabel = (unitType: string) => {
    switch (unitType) {
      case 'hour':
        return 'Unit price';
      case 'day':
        return 'Day rate';
      case 'item':
      default:
        return 'Unit price';
    }
  };

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
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-600 rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium border-r border-blue-400">Description</th>
              <th className="px-4 py-3 text-center text-sm font-medium border-r border-blue-400 w-24">Quantity</th>
              <th className="px-4 py-3 text-right text-sm font-medium border-r border-blue-400 w-24">Unit price</th>
              <th className="px-4 py-3 text-center text-sm font-medium border-r border-blue-400 w-20">VAT</th>
              <th className="px-4 py-3 text-right text-sm font-medium border-r border-blue-400 w-24">Amount</th>
              <th className="px-4 py-3 text-center text-sm font-medium w-20 no-print">Unit</th>
              <th className="px-4 py-3 text-center text-sm font-medium w-12 no-print">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className={`border-b border-gray-200 dark:border-gray-600 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-600">
                  <Input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                    className="w-full border-0 bg-transparent focus:ring-0 focus:border-0"
                  />
                </td>
                <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(item.id, 'quantity', e.target.value)}
                      className="w-16 text-center border-0 bg-transparent focus:ring-0 focus:border-0"
                      min="0"
                      step="0.01"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.unitType === 'hour' ? 'hours' : item.unitType === 'day' ? 'days' : 'items'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-600">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={(e) => onUpdateItem(item.id, 'rate', e.target.value)}
                    className="w-full text-right border-0 bg-transparent focus:ring-0 focus:border-0"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-1">
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.vatPercent}
                      onChange={(e) => onUpdateItem(item.id, 'vatPercent', e.target.value)}
                      className="w-12 text-center border-0 bg-transparent focus:ring-0 focus:border-0"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                  {formatCurrency(parseFloat(item.total) || 0, currency)}
                </td>
                <td className="px-4 py-3 text-center no-print border-r border-gray-200 dark:border-gray-600">
                  <Select value={item.unitType} onValueChange={(value) => onUpdateItem(item.id, 'unitType', value)}>
                    <SelectTrigger className="w-20 border-0 bg-transparent focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="item">Item</SelectItem>
                      <SelectItem value="hour">Hour</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
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
