import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div 
          className="w-10 h-10 rounded-md border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
        />
        <Input
          type="color"
          value={value}
          className="w-full h-10"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}