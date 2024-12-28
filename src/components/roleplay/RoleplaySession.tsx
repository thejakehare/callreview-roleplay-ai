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
      // The API returns the conversation ID directly as a string
      const conversationId = await conversation.startSession({
        agentId: "XTS4FbykwXxtp9z1Ex9r",
      });

      // Create a new session record when starting
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
      const { data: { api_key }, error } = await supabase.functions.invoke('get-elevenlabs-key');
      
      if (error || !api_key) {
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

      return await response.json();
    } catch (error) {
      console.error("Error fetching conversation data:", error);
      throw error;
    }
  };

  const saveSessionData = async (conversationData: any) => {
    try {
      if (!session?.user?.id || !currentSessionId) {
        console.error("No user ID or session ID found");
        return;
      }

      // Extract relevant data from the conversation
      const duration = Math.round(conversationData.duration_seconds || 0);
      const summary = conversationData.summary || "";
      const feedback = JSON.stringify(conversationData.feedback || {});

      const { error } = await supabase
        .from("sessions")
        .update({
          duration,
          summary,
          feedback,
        })
        .eq('id', currentSessionId);

      if (error) {
        throw error;
      }

      toast.success("Session saved successfully");
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Failed to save session");
    }
  };

  const endSession = async () => {
    try {
      // Get the current session's conversation_id from the database
      if (!currentSessionId) {
        throw new Error("No current session ID found");
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .select("conversation_id")
        .eq("id", currentSessionId)
        .single();

      if (sessionError || !sessionData?.conversation_id) {
        throw new Error("Failed to retrieve conversation ID");
      }

      // End the conversation with ElevenLabs
      await conversation.endSession();
      
      toast.loading("Processing conversation data...");
      
      // Use the stored conversation_id to fetch the final data
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