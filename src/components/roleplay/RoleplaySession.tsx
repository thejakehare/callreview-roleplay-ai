import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react";

export const RoleplaySession = () => {
  const [isActive, setIsActive] = useState(false);
  const conversation = useConversation();

  const startSession = async () => {
    try {
      await conversation.startSession({
        agentId: "XTS4FbykwXxtp9z1Ex9r",
      });
      setIsActive(true);
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  const endSession = async () => {
    await conversation.endSession();
    setIsActive(false);
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
      <div className="flex-grow flex items-center justify-center">
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