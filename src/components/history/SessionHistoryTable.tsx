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
            <TableHead className="text-primary">Summary</TableHead>
            <TableHead className="text-primary">Feedback</TableHead>
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
              <TableCell className="text-foreground">{session.summary || "No summary"}</TableCell>
              <TableCell className="text-foreground">{session.feedback || "No feedback"}</TableCell>
            </TableRow>
          ))}
          {sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No sessions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};