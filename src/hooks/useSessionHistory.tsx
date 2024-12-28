import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

export const useSessionHistory = () => {
  const [sessions, setSessions] = useState<(Tables<"sessions"> & { is_favorite?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please login to view your sessions");
          setLoading(false);
          return;
        }

        // Fetch sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("sessions")
          .select("*")
          .order("created_at", { ascending: false });

        if (sessionsError) {
          console.error("Error fetching sessions:", sessionsError);
          toast.error("Failed to load sessions");
          return;
        }

        // Fetch favorites for the current user
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorites")
          .select("session_id")
          .eq("user_id", user.id);

        if (favoritesError) {
          console.error("Error fetching favorites:", favoritesError);
          toast.error("Failed to load favorites");
          return;
        }

        // Create a Set of favorite session IDs for efficient lookup
        const favoriteSessionIds = new Set(favoritesData?.map(f => f.session_id));

        // Combine sessions with favorite information
        const sessionsWithFavorites = sessionsData?.map(session => ({
          ...session,
          is_favorite: favoriteSessionIds.has(session.id)
        })) || [];

        setSessions(sessionsWithFavorites);
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading sessions");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSessions();

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
          // Refetch sessions and favorites when changes occur
          fetchSessions();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { sessions, loading };
};