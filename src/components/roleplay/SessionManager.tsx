import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SessionManagerProps {
  userId: string;
  conversationId: string;
  sessionId: string;
}

interface ElevenLabsResponse {
  transcript: {
    role: string;
    message: string;
    time_in_call_secs: number;
  }[];
  metadata?: {
    call_duration_secs?: number;
  };
  analysis?: {
    transcript_summary?: string;
    data_collection_results?: {
      Topic?: {
        value: string;
      };
    };
    call_successful?: string;
  };
}

export const useSessionManager = ({ userId, sessionId }: SessionManagerProps) => {
  const saveSessionData = async (conversationData: ElevenLabsResponse) => {
    try {
      if (!userId || !sessionId) {
        console.error("No user ID or session ID found");
        return;
      }

      // Extract only the specific fields we need from the response
      const { error } = await supabase
        .from("sessions")
        .update({
          status: 'completed',
          transcript: JSON.stringify(conversationData.transcript),
          duration: conversationData.metadata?.call_duration_secs,
          summary: conversationData.analysis?.transcript_summary,
          topic_value: conversationData.analysis?.data_collection_results?.Topic?.value,
          call_successful: conversationData.analysis?.call_successful,
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

      const data: ElevenLabsResponse = await response.json();
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