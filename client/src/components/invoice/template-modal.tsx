import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Calendar } from "lucide-react";
import type { Template } from "@shared/schema";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSaveTemplate: (name: string) => void;
  onLoadTemplate: (templateId: number) => void;
  onDeleteTemplate: (templateId: number) => void;
  isLoading: boolean;
}

export function TemplateModal({
  isOpen,
  onClose,
  templates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  isLoading
}: TemplateModalProps) {
  const [templateName, setTemplateName] = useState("");

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveTemplate(templateName.trim());
      setTemplateName("");
    }
  };

  const handleDeleteTemplate = (templateId: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      onDeleteTemplate(templateId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Template Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <ScrollArea className="h-60">
            <div className="space-y-2">
              {templates.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No templates saved yet
                </div>
              ) : (
                templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onLoadTemplate(template.id)}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{template.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Created: {new Date(template.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <Input
              type="text"
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="mb-3"
            />
            <Button
              onClick={handleSaveTemplate}
              disabled={!templateName.trim() || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Current as Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
