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
    <div className="flex min-h-screen items-center justify-center">
      <Button
        size="icon"
        onClick={isActive ? endSession : startSession}
        className={`flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-full transition-all ${
          isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        }`}
      >
        {isActive ? (
          <>
            <MicOff className="h-12 w-12" />
            <span className="text-xs">End Session</span>
          </>
        ) : (
          <>
            <Mic className="h-12 w-12" />
            <span className="text-xs">Start Roleplay</span>
          </>
        )}
      </Button>
    </div>
  );
};