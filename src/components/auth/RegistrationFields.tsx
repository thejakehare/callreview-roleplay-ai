import { FormInput } from "./FormInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Link, Users } from "lucide-react";

interface RegistrationFieldsProps {
  website: string;
  setWebsite: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const roleDisplayNames: Record<string, string> = {
  sales_rep: "Sales Rep",
  sales_manager: "Sales Manager",
  founder_ceo: "Founder/CEO",
  other: "Other"
};

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
            <SelectItem value="sales_rep" className="focus:bg-[#333333] cursor-pointer">
              {roleDisplayNames.sales_rep}
            </SelectItem>
            <SelectItem value="sales_manager" className="focus:bg-[#333333] cursor-pointer">
              {roleDisplayNames.sales_manager}
            </SelectItem>
            <SelectItem value="founder_ceo" className="focus:bg-[#333333] cursor-pointer">
              {roleDisplayNames.founder_ceo}
            </SelectItem>
            <SelectItem value="other" className="focus:bg-[#333333] cursor-pointer">
              {roleDisplayNames.other}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};