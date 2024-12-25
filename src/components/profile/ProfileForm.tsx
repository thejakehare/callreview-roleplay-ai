import { FormInput } from "@/components/auth/FormInput";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleDisplayNames } from "@/utils/roleUtils";

interface ProfileFormProps {
  website: string;
  role: string;
  loading: boolean;
  onResetPassword: () => void;
}

export const ProfileForm = ({ 
  website, 
  role, 
  loading, 
  onResetPassword 
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <FormInput
        type="url"
        label="Company Website"
        placeholder="https://example.com"
        value={website}
        onChange={() => {}}
        icon={Link}
        readOnly
      />

      <FormInput
        type="text"
        label="Role"
        value={roleDisplayNames[role] || role}
        onChange={() => {}}
        readOnly
      />

      <Button
        onClick={onResetPassword}
        className="w-full"
        disabled={loading}
      >
        Reset Password
      </Button>
    </div>
  );
};