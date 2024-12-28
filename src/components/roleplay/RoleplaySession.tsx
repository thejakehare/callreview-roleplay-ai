import { useEffect, useState } from "react";
import { useConversation } from "@11labs/react";
import { ScrollingPrompts } from "./ScrollingPrompts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { SessionControls } from "./SessionControls";
import { SessionFooter } from "./SessionFooter";
import { useSessionManager } from "./SessionManager";

export const RoleplaySession = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const conversation = useConversation();
  const { session } = useAuth();

  const sessionManager = useSessionManager({
    userId: session?.user?.id || "",
    conversationId: "",
    sessionId: currentSessionId || "",
  });

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
      
      const conversationData = await sessionManager.fetchConversationData(sessionData.conversation_id);
      await sessionManager.saveSessionData(conversationData);
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
        <SessionControls 
          isActive={isActive}
          onStart={startSession}
          onEnd={endSession}
        />
        {!isActive && <ScrollingPrompts />}
      </div>
      <SessionFooter />
    </div>
  );
};