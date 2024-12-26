import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

type AdminAccount = {
  account_id: string;
  accounts: {
    id: string;
    name: string;
  };
};

export const useInvitation = () => {
  const [email, setEmail] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const { data: adminAccounts = [], isLoading: loadingAccounts } = useQuery({
    queryKey: ['adminAccounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_members')
        .select(`
          account_id,
          accounts!inner (
            id,
            name
          )
        `)
        .eq('user_id', session?.user.id)
        .eq('role', 'admin');

      if (error) throw error;
      
      return (data || []).map(item => ({
        account_id: item.account_id,
        accounts: {
          id: item.accounts[0].id as string,
          name: item.accounts[0].name as string
        }
      }));
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

      const { data: account } = await supabase
        .from('accounts')
        .select('name')
        .eq('id', selectedAccountId)
        .single();

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

  return {
    email,
    setEmail,
    selectedAccountId,
    setSelectedAccountId,
    loading,
    adminAccounts,
    loadingAccounts,
    handleInvite,
  };
};