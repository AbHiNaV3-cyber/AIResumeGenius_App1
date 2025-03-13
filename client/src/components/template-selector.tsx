import { Template, TemplateStructure } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FileText, ChevronRight } from "lucide-react";

interface TemplateSelectorProps {
  templates: Template[];
  selectedId: number;
  onSelect: (id: number) => void;
  onNext: () => void;
}

export default function TemplateSelector({
  templates,
  selectedId,
  onSelect,
  onNext,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const structure = template.structure as TemplateStructure;
            return (
              <Card
                key={template.id}
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedId === template.id
                    ? "ring-2 ring-primary"
                    : "hover:bg-gray-50"
                )}
                onClick={() => onSelect(template.id)}
              >
                <div className="aspect-[8.5/11] bg-white rounded-lg border flex items-center justify-center mb-4">
                  <FileText
                    className="h-12 w-12"
                    style={{ color: structure.colors.primary }}
                  />
                </div>
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {template.description}
                </p>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex justify-end">
        <Button onClick={onNext}>
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}