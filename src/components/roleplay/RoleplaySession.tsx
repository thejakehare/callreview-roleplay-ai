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

  const saveSessionData = async (conversationData: any) => {
    try {
      if (!session?.user?.id) {
        console.error("No user ID found");
        return;
      }

      const { error } = await supabase.from("sessions").insert({
        user_id: session.user.id,
        duration: conversationData.metadata.call_duration_secs,
        summary: conversationData.analysis.transcript_summary,
        feedback: JSON.stringify(conversationData.metadata.feedback),
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
      const conversationData = await conversation.endSession();
      await saveSessionData(conversationData);
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