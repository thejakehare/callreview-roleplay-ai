import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react";
import { ScrollingPrompts } from "./ScrollingPrompts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export const RoleplaySession = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const conversation = useConversation();
  const { session } = useAuth();

  const startSession = async () => {
    try {
      console.log("Starting new session...");
      const conversationId = await conversation.startSession({
        agentId: "XTS4FbykwXxtp9z1Ex9r",
      });
      console.log("Received conversation ID:", conversationId);

      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("sessions")
          .insert({
            user_id: session.user.id,
            conversation_id: conversationId,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }
        console.log("Created session record:", data);
        setCurrentSessionId(data.id);
      }

      setIsActive(true);
    } catch (error) {
      console.error("Failed to start session:", error);
      toast.error("Failed to start session");
    }
  };

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
      if (!session?.user?.id || !currentSessionId) {
        console.error("No user ID or session ID found");
        return;
      }

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
        .eq('id', currentSessionId);

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

  const endSession = async () => {
    try {
      console.log("Ending session...");
      if (!currentSessionId) {
        throw new Error("No current session ID found");
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .select("conversation_id")
        .eq("id", currentSessionId)
        .single();

      if (sessionError || !sessionData?.conversation_id) {
        console.error("Failed to retrieve conversation ID:", sessionError);
        throw new Error("Failed to retrieve conversation ID");
      }

      console.log("Retrieved conversation_id:", sessionData.conversation_id);
      
      await conversation.endSession();
      console.log("ElevenLabs session ended");
      
      toast.loading("Processing conversation data...");
      
      const conversationData = await fetchConversationData(sessionData.conversation_id);
      await saveSessionData(conversationData);
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to end session");
    } finally {
      setIsActive(false);
      setCurrentSessionId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (isActive) {
        endSession();
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow flex flex-col items-center justify-center gap-8">
        <Button
          size="icon"
          onClick={isActive ? endSession : startSession}
          className={`flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-full transition-all animate-pulse ${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isActive ? (
            <>
              <MicOff className="h-16 w-16" />
              <span className="text-sm">End Session</span>
            </>
          ) : (
            <>
              <Mic className="h-16 w-16" />
              <span className="text-sm">Start Roleplay</span>
            </>
          )}
        </Button>
        {!isActive && <ScrollingPrompts />}
      </div>
      <div className="flex items-center justify-center gap-2 p-4">
        <span className="text-muted-foreground">Powered by</span>
        <img 
          src="/lovable-uploads/3b07f009-d5ac-4afa-a753-e8636bd1c59f.png" 
          alt="CallReviewAI Logo" 
          className="h-8"
        />
      </div>
    </div>
  );
};
