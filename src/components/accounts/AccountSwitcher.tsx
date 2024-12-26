import { Building, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccounts } from "./AccountContext";

export const AccountSwitcher = () => {
  const { currentAccount, accounts, switchAccount } = useAccounts();

  if (!currentAccount) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          <span className="max-w-[150px] truncate">{currentAccount.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => switchAccount(account.id)}
          >
            <Building className="h-4 w-4" />
            <span className="flex-1 truncate">{account.name}</span>
            {account.role === 'admin' && (
              <span className="text-xs text-muted-foreground">Admin</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};