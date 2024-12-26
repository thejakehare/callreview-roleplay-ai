import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

export const useSessionHistory = () => {
  const [sessions, setSessions] = useState<Tables<"sessions">[]>([]);
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

        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching sessions:", error);
          toast.error("Failed to load sessions");
          return;
        }

        setSessions(data || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { sessions, loading };
};