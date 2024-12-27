import { Building, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccounts } from "./AccountContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateAccountForm } from "./CreateAccountForm";

export const AccountSwitcher = () => {
  const { currentAccount, accounts, switchAccount } = useAccounts();
  const [createAccountOpen, setCreateAccountOpen] = useState(false);

  if (!currentAccount) return null;

  return (
    <>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCreateAccountOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Create New Account</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={createAccountOpen} onOpenChange={setCreateAccountOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
          </DialogHeader>
          <CreateAccountForm onSuccess={() => setCreateAccountOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};