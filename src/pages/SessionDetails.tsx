import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SessionHeader } from "@/components/session-details/SessionHeader";
import { SessionSummary } from "@/components/session-details/SessionSummary";
import { SessionTranscript } from "@/components/session-details/SessionTranscript";

interface ConversationData {
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

export const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Tables<"sessions"> | null>(null);
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConversationData = async (conversationId: string) => {
    try {
      const { data: keyData, error: keyError } = await supabase.functions.invoke('get-elevenlabs-key');
      
      if (keyError) {
        console.error("Error retrieving API key:", keyError);
        throw new Error('Failed to get API key: ' + keyError.message);
      }

      if (!keyData?.api_key) {
        console.error("No API key found in response:", keyData);
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
        const errorText = await response.text();
        console.error("ElevenLabs API error:", {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        
        if (response.status === 404) {
          toast.error("Conversation data not found or inaccessible");
          return null;
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Save the fetched data to the database
      const { error: updateError } = await supabase
        .from("sessions")
        .update({
          duration: data.metadata?.call_duration_secs || null,
          summary: data.analysis?.transcript_summary || null,
          transcript: JSON.stringify(data.transcript) || null,
          metadata: data.metadata || null,
          analysis: data.analysis || null,
          topic_value: data.analysis?.data_collection_results?.Topic?.value || null,
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating session with conversation data:", updateError);
        toast.error("Failed to save conversation data");
      }

      return data;
    } catch (error) {
      console.error("Error in fetchConversationData:", error);
      toast.error("Failed to load conversation data");
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching session:", error);
          toast.error("Failed to load session details");
          return;
        }

        setSession(data);

        if (data.conversation_id && (!data.transcript || !data.summary)) {
          console.log("Fetching conversation data from ElevenLabs...");
          const conversationData = await fetchConversationData(data.conversation_id);
          if (conversationData) {
            setConversationData(conversationData);
            // Refresh session data to get the updated values
            const { data: updatedSession, error: refreshError } = await supabase
              .from("sessions")
              .select("*")
              .eq("id", id)
              .single();
              
            if (!refreshError) {
              setSession(updatedSession);
            }
          }
        } else if (data.transcript) {
          // If we already have the transcript, parse it
          setConversationData({
            transcript: JSON.parse(data.transcript),
            metadata: data.metadata,
            analysis: data.analysis
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading session details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Session not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Button
        variant="outline"
        className="mb-8"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2" /> Back to Dashboard
      </Button>

      <Card className="bg-card border-0">
        <SessionHeader session={session} />
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1">
            {conversationData?.analysis?.transcript_summary && (
              <SessionSummary summary={conversationData.analysis.transcript_summary} />
            )}
            
            <SessionTranscript
              conversationId={session.conversation_id}
              loading={loading}
              transcript={conversationData?.transcript}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};