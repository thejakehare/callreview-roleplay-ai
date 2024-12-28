import { useEffect, useState } from "react";
import { useAccounts } from "@/components/accounts/AccountContext";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface TeamMember {
  id: string;
  role: string;
  profile: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface AccountMemberWithProfile {
  id: string;
  role: string;
  user_id: string;
}

export const TeamMembers = () => {
  const { currentAccount } = useAccounts();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentAccount) return;

      try {
        // First get account members
        const { data: memberData, error } = await supabase
          .from('account_members')
          .select(`
            id,
            role,
            user_id
          `)
          .eq('account_id', currentAccount.id);

        if (error) throw error;

        const typedMemberData = memberData as AccountMemberWithProfile[];

        // Then get profiles for these members
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', typedMemberData.map(member => member.user_id));

        if (profilesError) throw profilesError;

        // Get emails from auth.users
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) throw userError;

        // Create a map of user IDs to emails
        const userEmails = new Map<string, string>(
          (userData.users as User[]).map(user => [user.id, user.email || ''])
        );

        // Create a map of user IDs to profiles for easier lookup
        const profileMap = new Map(
          profilesData.map(profile => [profile.id, profile])
        );

        // Transform the data to match our interface
        const formattedMembers: TeamMember[] = typedMemberData.map(member => ({
          id: member.id,
          role: member.role,
          profile: {
            email: userEmails.get(member.user_id) || 'No email found',
            first_name: profileMap.get(member.user_id)?.first_name || null,
            last_name: profileMap.get(member.user_id)?.last_name || null
          }
        }));

        setMembers(formattedMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentAccount]);

  if (loading) {
    return <div>Loading team members...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                {member.profile.first_name || member.profile.last_name ? 
                  `${member.profile.first_name || ''} ${member.profile.last_name || ''}`.trim() : 
                  'No name provided'}
              </TableCell>
              <TableCell>{member.profile.email}</TableCell>
              <TableCell>
                <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                  {member.role}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};