import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Account } from "@/types/account";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during logout:', error);
        toast.error('Error during logout');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during logout');
    } finally {
      navigate("/");
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      if (!session?.user.id) {
        setLoading(false);
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error('Error loading profile');
          return;
        }

        if (profileData) {
          setAvatarUrl(profileData.avatar_url);
        }

        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .order('name');

        if (accountsError) {
          console.error('Error fetching accounts:', accountsError);
          toast.error('Error loading accounts');
          return;
        }

        setAccounts(accountsData || []);
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while loading profile');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [session?.user.id]);

  return (
    <header className="bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {accounts.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {accounts[0]?.name || "Select Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-popover border-border">
                {accounts.map((account) => (
                  <DropdownMenuItem
                    key={account.id}
                    onClick={() => navigate(`/accounts/${account.id}`)}
                    className="cursor-pointer"
                  >
                    {account.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/accounts")}
                  className="cursor-pointer"
                >
                  Manage Accounts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-10 h-10 rounded-full p-0 border border-transparent"
              disabled={loading}
            >
              {loading ? (
                <div className="w-full h-full rounded-full animate-pulse bg-primary/10" />
              ) : avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-primary/10 text-foreground">
                  {session?.user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
            <DropdownMenuItem 
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer"
            >
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/accounts")}
              className="cursor-pointer"
            >
              Accounts
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};