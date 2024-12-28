import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

interface SessionHistoryTableProps {
  sessions: Tables<"sessions">[];
}

export const SessionHistoryTable = ({ sessions }: SessionHistoryTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-accent hover:bg-accent/50">
            <TableHead className="text-primary">Date</TableHead>
            <TableHead className="text-primary">Duration</TableHead>
            <TableHead className="text-primary w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow 
              key={session.id}
              className="border-b border-accent hover:bg-accent/50 cursor-pointer"
              onClick={() => navigate(`/session/${session.id}`)}
            >
              <TableCell className="text-foreground">
                {format(new Date(session.created_at), "PPp")}
              </TableCell>
              <TableCell className="text-foreground">
                {session.duration ? `${session.duration} minutes` : "N/A"}
              </TableCell>
              <TableCell className="text-foreground">
                <FavoriteButton sessionId={session.id} />
              </TableCell>
            </TableRow>
          ))}
          {sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No sessions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};