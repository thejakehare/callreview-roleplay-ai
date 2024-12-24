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
        className={`h-32 w-32 rounded-full transition-all ${
          isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        }`}
      >
        {isActive ? (
          <MicOff className="h-12 w-12" />
        ) : (
          <Mic className="h-12 w-12" />
        )}
      </Button>
    </div>
  );
};