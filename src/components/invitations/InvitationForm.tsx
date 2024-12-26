import { useState } from "react";
import { Mail } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export const InvitationForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !session?.user.id) return;

    try {
      setLoading(true);

      // First, get the account where the user is an admin
      const { data: accountMember } = await supabase
        .from('account_members')
        .select('account_id, role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (!accountMember) {
        toast.error("You don't have permission to invite users");
        return;
      }

      // Create the invitation in the database
      const { data: invitation, error: invitationError } = await supabase
        .from('invitations')
        .insert({
          account_id: accountMember.account_id,
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
        .eq('id', accountMember.account_id)
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
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
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
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Invitation"}
      </Button>
    </form>
  );
};