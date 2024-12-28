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
import { FavoriteButton } from "./FavoriteButton";

type FavoriteWithSession = {
  session_id: string;
  sessions: Tables<"sessions">;
}

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
          .order('created_at', { ascending: false }) as { data: FavoriteWithSession[] | null, error: any };

        if (error) {
          console.error("Error fetching favorites:", error);
          toast.error("Failed to load favorites");
          return;
        }

        const favoriteSessions = data?.map(f => f.sessions) || [];
        setFavorites(favoriteSessions);
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading favorites");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchFavorites();

    // Subscribe to changes in the favorites table
    const channel = supabase
      .channel('favorites_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'favorites'
        },
        () => {
          // Refetch favorites when changes occur
          fetchFavorites();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
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
                <TableHead className="text-primary w-[50px]"></TableHead>
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
                  <TableCell className="text-foreground">
                    <FavoriteButton sessionId={session.id} initialFavorited={true} />
                  </TableCell>
                </TableRow>
              ))}
              {favorites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
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