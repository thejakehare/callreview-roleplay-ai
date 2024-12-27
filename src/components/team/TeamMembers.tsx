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

interface TeamMember {
  id: string;
  role: string;
  profile: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export const TeamMembers = () => {
  const { currentAccount } = useAccounts();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentAccount) return;

      try {
        const { data, error } = await supabase
          .from('account_members')
          .select(`
            id,
            role,
            profile:profiles!account_members_user_id_fkey (
              email:id(email),
              first_name,
              last_name
            )
          `)
          .eq('account_id', currentAccount.id);

        if (error) throw error;

        // Transform the data to match our interface
        const formattedMembers = (data || []).map(member => ({
          id: member.id,
          role: member.role,
          profile: {
            email: member.profile.email[0]?.email || 'No email found',
            first_name: member.profile.first_name,
            last_name: member.profile.last_name
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