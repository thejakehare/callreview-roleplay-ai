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
  const conversation = useConversation();
  const { session } = useAuth();

  const startSession = async () => {
    try {
      await conversation.startSession({
        agentId: "XTS4FbykwXxtp9z1Ex9r",
      });
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
      if (!session?.user?.id) {
        console.error("No user ID found");
        return;
      }

      // Extract relevant data from the conversation
      const duration = Math.round(conversationData.duration_seconds || 0);
      const summary = conversationData.summary || "";
      const feedback = JSON.stringify(conversationData.feedback || {});

      const { error } = await supabase.from("sessions").insert({
        user_id: session.user.id,
        duration,
        summary,
        feedback,
      });

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
      const result = await conversation.endSession();
      
      // Check if we have a conversation ID
      if (result?.conversationId) {
        // First show a loading toast
        toast.loading("Processing conversation data...");
        
        // Fetch the complete conversation data
        const conversationData = await fetchConversationData(result.conversationId);
        
        // Save the data to our database
        await saveSessionData(conversationData);
      } else {
        throw new Error("No conversation ID received");
      }
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to end session");
    } finally {
      setIsActive(false);
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