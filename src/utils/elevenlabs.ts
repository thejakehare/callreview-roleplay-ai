import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ElevenLabsResponse {
  transcript: {
    role: string;
    message: string;
    time_in_call_secs: number;
  }[];
  metadata?: {
    call_duration_secs: number;
  };
  analysis?: {
    transcript_summary: string;
    data_collection_results?: {
      Topic?: {
        value: string;
      };
    };
  };
}

export const fetchElevenLabsConversation = async (conversationId: string) => {
  try {
    console.log("Starting ElevenLabs conversation fetch for ID:", conversationId);
    
    const { data: keyData, error: keyError } = await supabase.functions.invoke('get-elevenlabs-key');
    
    if (keyError) {
      console.error("Error retrieving API key:", keyError);
      throw new Error('Failed to get API key: ' + keyError.message);
    }

    if (!keyData?.api_key) {
      console.error("No API key found in response:", keyData);
      throw new Error('No API key found in response');
    }

    console.log("Successfully retrieved API key, making request to ElevenLabs API...");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
      {
        headers: {
          "xi-api-key": keyData.api_key,
        },
      }
    );

    console.log("ElevenLabs API response status:", response.status);
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("ElevenLabs API error:", {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
      
      if (response.status === 404) {
        toast.error("Conversation data not found or inaccessible");
        return null;
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Successfully fetched conversation data:", {
      hasTranscript: !!responseData.transcript,
      transcriptLength: responseData.transcript?.length,
      hasSummary: !!responseData.analysis?.transcript_summary
    });

    return responseData as ElevenLabsResponse;
  } catch (error) {
    console.error("Error in fetchElevenLabsConversation:", error);
    toast.error("Failed to load conversation data");
    return null;
  }
};