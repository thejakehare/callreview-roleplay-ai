import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const SessionFavorites = () => {
  const [favorites, setFavorites] = useState<Tables<"sessions">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please login to view your favorites");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("favorites")
          .select(`
            session_id,
            sessions (*)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching favorites:", error);
          toast.error("Failed to load favorites");
          return;
        }

        // Extract the sessions from the joined query
        const favoriteSessions = data?.map(f => f.sessions) || [];
        setFavorites(favoriteSessions);
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <Card className="w-full bg-card border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Session Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Session Favorites</CardTitle>
      </CardHeader>
      <CardContent>
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
              {favorites.map((session) => (
                <TableRow 
                  key={session.id}
                  className="border-b border-accent hover:bg-accent/50"
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
              {favorites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No favorite sessions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};