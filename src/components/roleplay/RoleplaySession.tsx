import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react";

export const RoleplaySession = () => {
  const [isActive, setIsActive] = useState(false);
  const conversation = useConversation();

  const startSession = async () => {
    try {
      await conversation.startSession({
        agentId: "YOUR_AGENT_ID", // Replace with your agent ID
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
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Sales Roleplay Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={isActive ? endSession : startSession}
            className={`${
              isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary"
            } transition-colors`}
          >
            {isActive ? (
              <>
                <MicOff className="mr-2" /> End Session
              </>
            ) : (
              <>
                <Mic className="mr-2" /> Start Session
              </>
            )}
          </Button>
        </div>
        {isActive && (
          <div className="text-center text-sm text-muted-foreground">
            {conversation.isSpeaking
              ? "AI is speaking..."
              : "Listening for your response..."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};