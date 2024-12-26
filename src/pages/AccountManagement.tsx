import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreateAccountDialog } from "@/components/accounts/CreateAccountDialog";
import { AccountList } from "@/components/accounts/AccountList";

export const AccountManagement = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error: any) {
      toast.error('Error fetching accounts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-4xl mx-auto bg-card border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Account Management</CardTitle>
          <Button onClick={() => setShowCreateDialog(true)}>
            Create Account
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <AccountList accounts={accounts} onAccountsChange={fetchAccounts} />
          )}
        </CardContent>
      </Card>
      <CreateAccountDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onAccountCreated={fetchAccounts}
      />
    </div>
  );
};