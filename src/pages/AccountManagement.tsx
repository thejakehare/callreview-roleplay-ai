import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateAccountDialog } from "@/components/accounts/CreateAccountDialog";
import { AccountList } from "@/components/accounts/AccountList";

interface AccountWithMembers {
  id: string;
  name: string;
  created_at: string;
  account_members: {
    user_id: string;
  }[];
}

export const AccountManagement = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const fetchAccounts = async () => {
    try {
      console.log("Fetching accounts...");
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user?.id) {
        console.error("No user found");
        return;
      }

      const { data, error } = await supabase
        .from("accounts")
        .select(`
          id,
          name,
          created_at,
          account_members!inner (
            user_id
          )
        `)
        .eq('account_members.user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching accounts:", error);
        toast.error("Failed to load accounts");
        return;
      }

      console.log("Fetched accounts:", data);
      
      // Transform the data to match the Account type
      const transformedAccounts: Account[] = (data as AccountWithMembers[])?.map(({ id, name, created_at }) => ({
        id,
        name,
        created_at,
      })) || [];

      setAccounts(transformedAccounts);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while loading accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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