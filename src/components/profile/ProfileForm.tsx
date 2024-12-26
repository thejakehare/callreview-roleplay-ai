import { FormInput } from "@/components/auth/FormInput";
import { Link, User, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleDisplayNames } from "@/utils/roleUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  onRoleChange: (value: string) => void;
  onSave: () => void;
  onAvatarUpload: (file: File) => void;
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
  onLastNameChange,
  onRoleChange,
  onSave,
  onAvatarUpload
}: ProfileFormProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('avatar-upload')?.click()}
          className="w-auto"
        >
          Upload Profile Photo
        </Button>
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

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
        icon={Globe}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Role</label>
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(roleDisplayNames).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={onSave}
          className="w-full"
          disabled={loading}
        >
          Save Changes
        </Button>

        <Button
          onClick={onResetPassword}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
};