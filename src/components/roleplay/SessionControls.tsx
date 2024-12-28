import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface SessionControlsProps {
  isActive: boolean;
  onStart: () => void;
  onEnd: () => void;
}

export const SessionControls = ({ isActive, onStart, onEnd }: SessionControlsProps) => {
  return (
    <Button
      size="icon"
      onClick={isActive ? onEnd : onStart}
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
  );
};