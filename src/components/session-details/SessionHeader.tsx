import { format } from "date-fns";
import { Clock } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface SessionHeaderProps {
  session: Tables<"sessions"> & {
    metadata?: {
      call_duration_secs?: number;
    };
    analysis?: {
      transcript_summary?: string;
      data_collection_results?: {
        Topic?: {
          value: string;
        };
      };
    };
  };
}

export const SessionHeader = ({ session }: SessionHeaderProps) => {
  const title = session.topic_value || 
    session.analysis?.data_collection_results?.Topic?.value || 
    "Session Details";
  
  const duration = session.duration || 
    session.metadata?.call_duration_secs || 
    0;
  
  return (
    <CardHeader>
      <CardTitle className="text-2xl text-primary">
        {title}
      </CardTitle>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{format(new Date(session.created_at), "PPp")}</span>
        <Clock className="h-4 w-4 text-primary" />
        <span>
          {duration > 0
            ? `${Math.floor(duration / 60)} minutes`
            : "N/A"}
        </span>
      </div>
    </CardHeader>
  );
};