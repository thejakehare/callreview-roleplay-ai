import { useState } from "react";
import { Mail } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

type AdminAccount = {
  account_id: string;
  accounts: {
    id: string;
    name: string;
  };
};

export const InvitationForm = () => {
  const [email, setEmail] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  // Fetch accounts where the user is an admin
  const { data: adminAccounts = [], isLoading: loadingAccounts } = useQuery<AdminAccount[]>({
    queryKey: ['adminAccounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_members')
        .select(`
          account_id,
          accounts:account_id (
            id,
            name
          )
        `)
        .eq('user_id', session?.user.id)
        .eq('role', 'admin');

      if (error) throw error;
      return data as AdminAccount[];
    },
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !session?.user.id || !selectedAccountId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Create the invitation in the database
      const { data: invitation, error: invitationError } = await supabase
        .from('invitations')
        .insert({
          account_id: selectedAccountId,
          email,
          invited_by: session.user.id,
        })
        .select()
        .single();

      if (invitationError) throw invitationError;

      // Get the account name for the email
      const { data: account } = await supabase
        .from('accounts')
        .select('name')
        .eq('id', selectedAccountId)
        .single();

      // Call the edge function to send the invitation email
      const response = await fetch('/functions/v1/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          invitationId: invitation.id,
          accountName: account?.name || 'our team',
          inviteeEmail: email,
        }),
      });

      if (!response.ok) throw new Error('Failed to send invitation');

      toast.success('Invitation sent successfully');
      setEmail('');
      setSelectedAccountId('');
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAccounts) {
    return <div>Loading accounts...</div>;
  }

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="account" className="text-sm font-medium">
          Select Account
        </label>
        <Select
          value={selectedAccountId}
          onValueChange={setSelectedAccountId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            {adminAccounts.map((account) => (
              <SelectItem 
                key={account.accounts.id} 
                value={account.accounts.id}
              >
                {account.accounts.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FormInput
        type="email"
        label="Email Address"
        placeholder="colleague@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
        required
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !selectedAccountId}
      >
        {loading ? "Sending..." : "Send Invitation"}
      </Button>
    </form>
  );
};