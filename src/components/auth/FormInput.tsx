import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
  label?: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: LucideIcon;
  accept?: string;
}

export const FormInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
  accept,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="flex items-center gap-2 text-sm text-foreground">
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </Label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        accept={accept}
        className="bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
};