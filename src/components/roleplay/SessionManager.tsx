import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SessionManagerProps {
  userId: string;
  conversationId: string;
  sessionId: string;
}

export const useSessionManager = ({ userId, conversationId, sessionId }: SessionManagerProps) => {
  const fetchConversationData = async (conversationId: string) => {
    try {
      console.log("Fetching conversation data for ID:", conversationId);
      const { data: { api_key }, error } = await supabase.functions.invoke('get-elevenlabs-key');
      
      if (error || !api_key) {
        console.error("Failed to get API key:", error);
        throw new Error('Failed to get API key');
      }
      console.log("Successfully retrieved API key");

      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        {
          headers: {
            "xi-api-key": api_key,
          },
        }
      );

      if (!response.ok) {
        console.error("ElevenLabs API error:", response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Successfully fetched conversation data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching conversation data:", error);
      throw error;
    }
  };

  const saveSessionData = async (conversationData: any) => {
    try {
      console.log("Raw conversation data:", conversationData);
      if (!userId || !sessionId) {
        console.error("No user ID or session ID found");
        return;
      }

      // Extract duration from metadata.call_duration_secs
      const duration = conversationData.metadata?.call_duration_secs;
      const summary = conversationData.analysis?.transcript_summary || "";
      const feedback = JSON.stringify(conversationData.feedback || {});
      const transcript = JSON.stringify(conversationData.transcript || []);

      console.log("Data to be saved:", { duration, summary, feedback, transcript });

      const { error } = await supabase
        .from("sessions")
        .update({
          duration,
          summary,
          feedback,
          transcript,
        })
        .eq('id', sessionId);

      if (error) {
        console.error("Error updating session:", error);
        throw error;
      }

      console.log("Session saved successfully");
      toast.success("Session saved successfully");
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Failed to save session");
    }
  };

  return {
    fetchConversationData,
    saveSessionData,
  };
};