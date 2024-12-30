import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SessionManagerProps {
  userId: string;
  conversationId: string;
  sessionId: string;
}

interface ConversationData {
  transcript?: any;
  metadata?: any;
  analysis?: any;
}

export const useSessionManager = ({ userId, sessionId }: SessionManagerProps) => {
  const saveSessionData = async (conversationData: ConversationData) => {
    try {
      if (!userId || !sessionId) {
        console.error("No user ID or session ID found");
        return;
      }

      const { error } = await supabase
        .from("sessions")
        .update({
          status: 'completed',
          transcript: JSON.stringify(conversationData.transcript),
          metadata: conversationData.metadata,
          analysis: conversationData.analysis,
        })
        .eq('id', sessionId);

      if (error) {
        console.error("Error updating session:", error);
        throw error;
      }

      console.log("Session data saved successfully");
      toast.success("Session completed successfully");
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Failed to save session");
    }
  };

  const fetchConversationData = async (conversationId: string) => {
    try {
      const { data: keyData, error: keyError } = await supabase.functions.invoke('get-elevenlabs-key');
      
      if (keyError) {
        console.error("Error retrieving API key:", keyError);
        throw new Error('Failed to get API key');
      }

      if (!keyData?.api_key) {
        console.error("No API key found in response");
        throw new Error('No API key found in response');
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        {
          headers: {
            "xi-api-key": keyData.api_key,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching conversation data:", error);
      toast.error("Failed to fetch conversation data");
      throw error;
    }
  };

  return {
    saveSessionData,
    fetchConversationData,
  };
};