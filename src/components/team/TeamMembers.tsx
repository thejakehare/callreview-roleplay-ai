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
  };
}

// Define the shape of the raw data from Supabase
interface RawTeamMember {
  id: string;
  role: string;
  profile: {
    email: string;
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
            profile:user_id (
              email
            )
          `)
          .eq('account_id', currentAccount.id);

        if (error) throw error;
        
        // Explicitly type the data and transform it
        const rawMembers = data as RawTeamMember[];
        const formattedMembers = rawMembers.map(member => ({
          id: member.id,
          role: member.role,
          profile: {
            email: member.profile.email
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
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
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