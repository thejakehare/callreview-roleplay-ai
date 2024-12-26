import { FormInput } from "@/components/auth/FormInput";
import { Link, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleDisplayNames } from "@/utils/roleUtils";

interface ProfileFormProps {
  website: string;
  role: string;
  firstName: string;
  lastName: string;
  loading: boolean;
  onResetPassword: () => void;
  onWebsiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileForm = ({ 
  website, 
  role,
  firstName,
  lastName, 
  loading, 
  onResetPassword,
  onWebsiteChange,
  onFirstNameChange,
  onLastNameChange
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <FormInput
        type="text"
        label="First Name"
        placeholder="Enter your first name"
        value={firstName}
        onChange={onFirstNameChange}
        icon={User}
      />

      <FormInput
        type="text"
        label="Last Name"
        placeholder="Enter your last name"
        value={lastName}
        onChange={onLastNameChange}
        icon={User}
      />

      <FormInput
        type="url"
        label="Company Website"
        placeholder="https://example.com"
        value={website}
        onChange={onWebsiteChange}
        icon={Link}
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