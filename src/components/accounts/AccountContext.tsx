import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface Account {
  id: string;
  name: string;
  role: string;
}

interface AccountContextType {
  currentAccount: Account | null;
  accounts: Account[];
  loading: boolean;
  switchAccount: (accountId: string) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccounts must be used within an AccountProvider");
  }
  return context;
};

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('account_members')
        .select(`
          account:accounts(id, name),
          role
        `)
        .eq('user_id', session?.user.id);

      if (error) throw error;

      const formattedAccounts = data.map(({ account, role }) => ({
        id: account.id,
        name: account.name,
        role: role,
      }));

      setAccounts(formattedAccounts);

      // Set current account from localStorage or first available account
      const storedAccountId = localStorage.getItem('currentAccountId');
      const accountToSet = formattedAccounts.find(acc => acc.id === storedAccountId) 
        || formattedAccounts[0];
      
      if (accountToSet) {
        setCurrentAccount(accountToSet);
        localStorage.setItem('currentAccountId', accountToSet.id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchAccounts();
    }
  }, [session?.user.id]);

  const switchAccount = (accountId: string) => {
    const newAccount = accounts.find(acc => acc.id === accountId);
    if (newAccount) {
      setCurrentAccount(newAccount);
      localStorage.setItem('currentAccountId', accountId);
      toast.success(`Switched to ${newAccount.name}`);
    }
  };

  return (
    <AccountContext.Provider value={{ currentAccount, accounts, loading, switchAccount }}>
      {children}
    </AccountContext.Provider>
  );
};