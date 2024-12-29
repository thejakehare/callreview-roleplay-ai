import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ConversationData {
  transcript: Array<{
    role: string;
    content: string;
  }>;
}

export const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Tables<"sessions"> | null>(null);
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConversationData = async (conversationId: string) => {
    try {
      const { data: { api_key }, error: keyError } = await supabase.functions.invoke('get-elevenlabs-key');
      
      if (keyError || !api_key) {
        console.error("Failed to get API key:", keyError);
        throw new Error('Failed to get API key');
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        {
          headers: {
            "xi-api-key": api_key,
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
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("Failed to load session details");
          return;
        }

        setSession(data);

        if (data.conversation_id) {
          const conversationData = await fetchConversationData(data.conversation_id);
          setConversationData(conversationData);
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
            <Card className="bg-accent/50 border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-medium">Transcript</span>
                </div>
                <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                  {conversationData?.transcript?.map((entry, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0">
                      <p className="font-medium mb-1">{entry.role === "assistant" ? "AI" : "You"}</p>
                      <p className="text-muted-foreground">{entry.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};