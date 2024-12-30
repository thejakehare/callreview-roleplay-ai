import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TranscriptEntry {
  role: string;
  message: string;
  time_in_call_secs: number;
}

interface SessionTranscriptProps {
  conversationId: string | null;
  loading: boolean;
  transcript: TranscriptEntry[] | undefined;
}

export const SessionTranscript = ({ conversationId, loading, transcript }: SessionTranscriptProps) => {
  return (
    <Card className="bg-accent/50 border-0">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="font-medium">Transcript</span>
        </div>
        <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
          {!conversationId ? (
            <p className="text-muted-foreground">No transcript available for this session.</p>
          ) : loading ? (
            <p className="text-muted-foreground">Loading transcript...</p>
          ) : transcript ? (
            transcript.map((entry, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-0">
                <p className="font-medium mb-1">{entry.role === "agent" ? "AI" : "You"}</p>
                <p className="text-muted-foreground">{entry.message}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Failed to load transcript.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};