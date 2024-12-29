import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, MessageSquare, FileText } from "lucide-react";
import { toast } from "sonner";

interface TranscriptEntry {
  role: string;
  message: string;
  time_in_call_secs: number;
}

interface ConversationData {
  transcript: TranscriptEntry[];
  metadata?: {
    call_duration_secs: number;
  };
  analysis?: {
    transcript_summary: string;
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
      console.log("Starting fetchConversationData for ID:", conversationId);
      
      console.log("Attempting to retrieve ElevenLabs API key...");
      const { data: keyData, error: keyError } = await supabase.functions.invoke('get-elevenlabs-key');
      
      if (keyError) {
        console.error("Error retrieving API key:", keyError);
        throw new Error('Failed to get API key: ' + keyError.message);
      }

      if (!keyData?.api_key) {
        console.error("No API key found in response:", keyData);
        throw new Error('No API key found in response');
      }

      console.log("Successfully retrieved API key");

      console.log("Making request to ElevenLabs API...");
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
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      console.log("Successfully received conversation data:", data);
      return data;
    } catch (error) {
      console.error("Error in fetchConversationData:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching session data for ID:", id);

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

        console.log("Session data retrieved:", data);
        setSession(data);

        if (data.conversation_id) {
          console.log("Found conversation_id:", data.conversation_id);
          try {
            const conversationData = await fetchConversationData(data.conversation_id);
            console.log("Setting conversation data:", conversationData);
            setConversationData(conversationData);
          } catch (error) {
            console.error("Error fetching conversation:", error);
            toast.error("Failed to load conversation transcript");
          }
        } else {
          console.log("No conversation_id found in session data");
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
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Session Details
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{format(new Date(session.created_at), "PPp")}</span>
            <Clock className="h-4 w-4 text-primary" />
            <span>{session.duration ? `${session.duration} minutes` : "N/A"}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1">
            {conversationData?.analysis?.transcript_summary && (
              <Card className="bg-accent/50 border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">Summary</span>
                  </div>
                  <p className="text-muted-foreground">
                    {conversationData.analysis.transcript_summary}
                  </p>
                </CardContent>
              </Card>
            )}
            
            <Card className="bg-accent/50 border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-medium">Transcript</span>
                </div>
                <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                  {!session.conversation_id ? (
                    <p className="text-muted-foreground">No transcript available for this session.</p>
                  ) : loading ? (
                    <p className="text-muted-foreground">Loading transcript...</p>
                  ) : conversationData?.transcript ? (
                    conversationData.transcript.map((entry, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-0">
                        <p className="font-medium mb-1">{entry.role === "agent" ? "AI" : "You"}</p>
                        <p className="text-muted-foreground">{entry.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Failed to load transcript.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};