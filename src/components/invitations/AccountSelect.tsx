import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Account = {
  id: string;
  name: string;
};

interface AccountSelectProps {
  accounts: Account[];
  selectedAccountId: string;
  onSelect: (accountId: string) => void;
}

export const AccountSelect = ({ accounts, selectedAccountId, onSelect }: AccountSelectProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="account" className="text-sm font-medium">
        Select Account
      </label>
      <Select
        value={selectedAccountId}
        onValueChange={onSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem 
              key={account.id} 
              value={account.id}
            >
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};