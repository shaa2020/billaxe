import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Template } from "@shared/schema";

interface TemplateData {
  invoiceNumber: string;
  companyName: string;
  companyTagline: string;
  companyLogo?: string;
  fromName: string;
  fromAddress: string;
  fromEmail: string;
  fromPhone: string;
  fromVAT: string;
  currency: string;
  paymentTerms: string;
  paymentInstructions?: string;
  invoiceNotes?: string;
  items: Array<{
    description: string;
    quantity: string;
    rate: string;
    vatPercent: string;
    unitType: string;
  }>;
}

export function useTemplates() {
  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  const saveTemplate = useMutation({
    mutationFn: async ({ name, data }: { name: string; data: TemplateData }) => {
      const templatePayload = {
        name,
        companyName: data.companyName,
        companyTagline: data.companyTagline,
        companyLogo: data.companyLogo,
        fromName: data.fromName,
        fromAddress: data.fromAddress,
        fromEmail: data.fromEmail,
        fromPhone: data.fromPhone,
        fromVAT: data.fromVAT,
        currency: data.currency,
        paymentTerms: data.paymentTerms,
        paymentInstructions: data.paymentInstructions,
        invoiceNotes: data.invoiceNotes,
        items: data.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          vatPercent: item.vatPercent,
          unitType: item.unitType,
        })),
      };
      
      return await apiRequest('POST', '/api/templates', templatePayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  const loadTemplate = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) {
        throw new Error('Failed to load template');
      }
      return response.json();
    },
    onSuccess: (templateData) => {
      // This will be handled by the parent component
      // to update the current invoice data
      return templateData;
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (templateId: number) => {
      return await apiRequest('DELETE', `/api/templates/${templateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
  };
}
