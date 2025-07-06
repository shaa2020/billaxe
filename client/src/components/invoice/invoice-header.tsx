import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Logo from "@/assets/billaxe-logo.svg";

interface InvoiceHeaderProps {
  invoiceData: {
    companyName: string;
    companyTagline: string;
    companyLogo?: string;
    invoiceNumber: string;
  };
  onUpdate: (data: Partial<InvoiceHeaderProps['invoiceData']>) => void;
}

export function InvoiceHeader({ invoiceData, onUpdate }: InvoiceHeaderProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        onUpdate({ companyLogo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="brand-gradient text-white p-8">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all relative">
            {logoPreview || invoiceData.companyLogo ? (
              <img 
                src={logoPreview || invoiceData.companyLogo} 
                alt="Company Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <Upload className="text-white text-xl" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Your Company Name"
              value={invoiceData.companyName}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              className="bg-transparent text-2xl font-bold placeholder-blue-100 border-0 outline-none text-white w-full ring-0 focus-visible:ring-0"
            />
            <Input
              type="text"
              placeholder="Your tagline or slogan"
              value={invoiceData.companyTagline}
              onChange={(e) => onUpdate({ companyTagline: e.target.value })}
              className="bg-transparent text-sm placeholder-blue-100 border-0 outline-none text-blue-100 w-full mt-1 ring-0 focus-visible:ring-0"
            />
          </div>
        </div>
        
        <div className="text-right">
          <h1 className="text-4xl font-bold">INVOICE</h1>
          <div className="mt-2 text-blue-100 flex items-center">
            <span className="mr-2">Invoice #</span>
            <Input
              type="text"
              value={invoiceData.invoiceNumber}
              onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
              className="bg-transparent border-0 outline-none text-blue-100 w-20 ring-0 focus-visible:ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
