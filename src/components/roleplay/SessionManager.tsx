import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SessionManagerProps {
  userId: string;
  conversationId: string;
  sessionId: string;
}

export const useSessionManager = ({ userId, sessionId }: SessionManagerProps) => {
  const saveSessionData = async () => {
    try {
      if (!userId || !sessionId) {
        console.error("No user ID or session ID found");
        return;
      }

      const { error } = await supabase
        .from("sessions")
        .update({
          status: 'completed'
        })
        .eq('id', sessionId);

      if (error) {
        console.error("Error updating session:", error);
        throw error;
      }

      console.log("Session marked as completed");
      toast.success("Session completed successfully");
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Failed to save session");
    }
  };

  return {
    saveSessionData,
  };
};