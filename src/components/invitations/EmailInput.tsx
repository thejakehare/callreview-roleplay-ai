import { Mail } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";

interface EmailInputProps {
  email: string;
  onChange: (email: string) => void;
}

export const EmailInput = ({ email, onChange }: EmailInputProps) => {
  return (
    <FormInput
      type="email"
      label="Email Address"
      placeholder="colleague@company.com"
      value={email}
      onChange={(e) => onChange(e.target.value)}
      icon={Mail}
      required
    />
  );
};