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
import { fetchElevenLabsConversation } from "@/utils/elevenlabs";

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
          const conversationData = await fetchElevenLabsConversation(data.conversation_id);
          
          if (conversationData) {
            setConversationData(conversationData);
            
            // Update session with the new data
            const { error: updateError } = await supabase
              .from("sessions")
              .update({
                duration: conversationData.metadata?.call_duration_secs || null,
                summary: conversationData.analysis?.transcript_summary || null,
                transcript: JSON.stringify(conversationData.transcript) || null,
                topic_value: conversationData.analysis?.data_collection_results?.Topic?.value || null,
              })
              .eq("id", id);

            if (updateError) {
              console.error("Error updating session:", updateError);
              toast.error("Failed to save conversation data");
            } else {
              // Refresh session data
              const { data: updatedSession, error: refreshError } = await supabase
                .from("sessions")
                .select("*")
                .eq("id", id)
                .single();
                
              if (!refreshError) {
                setSession(updatedSession);
              }
            }
          }
        } else if (data.transcript) {
          // If we already have the transcript, parse it
          setConversationData({
            transcript: JSON.parse(data.transcript),
            metadata: { call_duration_secs: data.duration || 0 },
            analysis: {
              transcript_summary: data.summary || '',
              data_collection_results: {
                Topic: { value: data.topic_value || '' }
              }
            }
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