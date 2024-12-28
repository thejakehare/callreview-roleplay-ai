import { FormInput } from "./FormInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Link, Users } from "lucide-react";
import { roleDisplayNames } from "@/utils/roleUtils";

interface RegistrationFieldsProps {
  website: string;
  setWebsite: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RegistrationFields = ({
  website,
  setWebsite,
  role,
  setRole,
  onAvatarChange,
}: RegistrationFieldsProps) => {
  return (
    <>
      <FormInput
        type="file"
        label="Profile Picture"
        accept="image/*"
        onChange={onAvatarChange}
        icon={Camera}
        value=""
      />

      <FormInput
        type="url"
        label="Company Website"
        placeholder="https://example.com"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        icon={Link}
      />

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Users className="h-4 w-4" />
          Role
        </label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="bg-secondary border-0 text-foreground">
            <SelectValue placeholder="Select your role">
              {role ? roleDisplayNames[role] : "Select your role"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-[#222222] border-0">
            {Object.entries(roleDisplayNames).map(([value, label]) => (
              <SelectItem 
                key={value} 
                value={value} 
                className="focus:bg-[#333333] cursor-pointer"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};