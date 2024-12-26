import { Account } from "@/types/account";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AccountListProps {
  accounts: Account[];
  onAccountsChange: () => void;
}

export const AccountList = ({ accounts, onAccountsChange }: AccountListProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <Card key={account.id} className="p-4 flex items-center justify-between bg-card">
          <div>
            <h3 className="text-lg font-medium text-foreground">{account.name}</h3>
            <p className="text-sm text-muted-foreground">
              Created {new Date(account.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={() => navigate(`/accounts/${account.id}`)}>
            Manage
          </Button>
        </Card>
      ))}
      {accounts.length === 0 && (
        <p className="text-center text-muted-foreground">No accounts found</p>
      )}
    </div>
  );
};