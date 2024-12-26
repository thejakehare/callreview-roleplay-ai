import { FormInput } from "@/components/auth/FormInput";
import { User, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleDisplayNames } from "@/utils/roleUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormProps {
  role: string;
  firstName: string;
  lastName: string;
  loading: boolean;
  onResetPassword: () => void;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (value: string) => void;
  onSave: () => void;
  onAvatarUpload: (file: File) => void;
  isSetupProfile?: boolean;
}

export const ProfileForm = ({ 
  role,
  firstName,
  lastName, 
  loading, 
  onResetPassword,
  onFirstNameChange,
  onLastNameChange,
  onRoleChange,
  onSave,
  onAvatarUpload,
  isSetupProfile = false
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Role</label>
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {Object.entries(roleDisplayNames).map(([value, label]) => (
              <SelectItem 
                key={value} 
                value={value}
                className="hover:bg-accent focus:bg-accent"
              >
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
          {isSetupProfile ? "Create Your Account" : "Save Changes"}
        </Button>

        {!isSetupProfile && (
          <Button
            onClick={onResetPassword}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            Reset Password
          </Button>
        )}
      </div>
    </div>
  );
};