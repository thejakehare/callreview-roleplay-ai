import { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  readOnly?: boolean;
}

export const FormInput = ({ label, icon: Icon, readOnly, ...props }: FormInputProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <Input
          {...props}
          readOnly={readOnly}
          className={`${Icon ? 'pl-10' : ''} ${readOnly ? 'bg-muted cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
};