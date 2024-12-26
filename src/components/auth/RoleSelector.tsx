import { Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roleDisplayNames } from "@/utils/roleUtils";

interface RoleSelectorProps {
  role: string;
  setRole: (value: string) => void;
}

export const RoleSelector = ({ role, setRole }: RoleSelectorProps) => {
  return (
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
  );
};